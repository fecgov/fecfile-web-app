import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
// import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import {
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-types/transaction-type.model';
import { Transaction, ScheduleTransaction, ScheduleTransactionTypes } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';

@Component({
  template: '',
})
export abstract class TransactionTypeBaseComponent implements OnInit, OnDestroy {
  @Input() transaction: Transaction | undefined;

  abstract formProperties: string[];
  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  contactId$: Subject<string> = new BehaviorSubject<string>('');
  formSubmitted = false;
  memoItemHelpText = 'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';
  purposeDescriptionLabel = '';
  // childTransactionOptions: { [key: string]: string | ScheduleATransactionTypes }[] = [];
  negativeAmountValueOnly = false;
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;

  form: FormGroup = this.fb.group({});

  constructor(
    protected messageService: MessageService,
    public transactionService: TransactionService,
    protected contactService: ContactService,
    protected validateService: ValidateService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
    if (this.transaction?.transactionType?.templateMap) {
      this.templateMap = this.transaction.transactionType.templateMap;
    }
    TransactionFormUtils.onInit(this, this.form, this.validateService, this.transaction, this.contactId$);
    this.parentOnInit();
  }

  parentOnInit() {
    // Override contact type options if present in transactionType
    if (this.transaction?.transactionType && this.transaction?.transactionType.contactTypeOptions) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(
        ContactTypeLabels,
        this.transaction.transactionType.contactTypeOptions
      );
    }

    if (this.templateMap?.amount) {
      const amount_schema = this.transaction?.transactionType?.schema.properties[this.templateMap.amount];
      if (amount_schema?.exclusiveMaximum === 0) {
        this.negativeAmountValueOnly = true;
        this.form
          .get(this.templateMap.amount)
          ?.valueChanges.pipe(takeUntil(this.destroy$))
          .subscribe((amount) => {
            if (typeof amount === 'number' && amount > 0) {
              this.form.patchValue({ amount: -1 * amount });
            }
          });
      }
    }

    if (this.transaction?.transactionType?.generatePurposeDescriptionLabel) {
      this.purposeDescriptionLabel = this.transaction?.transactionType.generatePurposeDescriptionLabel();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.contactId$.complete();
  }

  save(navigationEvent: NavigationEvent) {
    this.formSubmitted = true;

    if (this.form.invalid) {
      return;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.validateService,
      this.form,
      this.formProperties
    );

    this.confirmSave(payload, this.form, this.doSave, navigationEvent, payload);
  }

  protected confirmSave(
    confirmTransaction: Transaction,
    form: FormGroup,
    acceptCallback: (navigationEvent: NavigationEvent, payload: Transaction) => void,
    navigationEvent: NavigationEvent,
    payload: Transaction,
    targetDialog: 'dialog' | 'childDialog' = 'dialog'
  ) {
    if (
      confirmTransaction.contact_id &&
      confirmTransaction.contact &&
      confirmTransaction?.transactionType?.templateMap
    ) {
      const transactionContactChanges = TransactionContactUtils.setTransactionContactFormChanges(
        form,
        confirmTransaction.contact,
        confirmTransaction.transactionType.templateMap
      );
      if (transactionContactChanges?.length) {
        const confirmationMessage = TransactionContactUtils.getEditTransactionContactConfirmationMessage(
          transactionContactChanges,
          confirmTransaction.contact,
          form,
          this.fecDatePipe,
          confirmTransaction.transactionType.templateMap
        );
        this.confirmationService.confirm({
          key: targetDialog,
          header: 'Confirm',
          icon: 'pi pi-info-circle',
          message: confirmationMessage,
          acceptLabel: 'Continue',
          rejectLabel: 'Cancel',
          accept: () => {
            acceptCallback.call(this, navigationEvent, payload);
          },
          reject: () => {
            return;
          },
        });
      } else {
        acceptCallback.call(this, navigationEvent, payload);
      }
    } else {
      if (confirmTransaction?.transactionType?.templateMap) {
        const confirmationMessage = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
          (confirmTransaction as ScheduleTransaction).entity_type as ContactTypes,
          form,
          confirmTransaction.transactionType.templateMap
        );
        this.confirmationService.confirm({
          key: targetDialog,
          header: 'Confirm',
          icon: 'pi pi-info-circle',
          message: confirmationMessage,
          acceptLabel: 'Continue',
          rejectLabel: 'Cancel',
          accept: () => {
            acceptCallback.call(this, navigationEvent, payload);
          },
          reject: () => {
            return;
          },
        });
      } else {
        throw new Error('Cannot find template map when confirming transaction');
      }
    }
  }

  protected doSave(navigationEvent: NavigationEvent, payload: Transaction) {
    if (payload.transaction_type_identifier) {
      const originalTransaction = payload;
      // Reorganize the payload if this transaction type can update its parent transaction
      // This will break the scenario where the user creates a grandparent, then child, then tries
      // to create a grandchild transaction because we won't know which child transaction of the grandparent
      // was the original transaction it's id was generated on the api.  the middle child's
      // id is necessary to generate the url for creating the grandchild.
      const transactionType = TransactionTypeUtils.factory(payload.transaction_type_identifier);
      if (transactionType.updateParentOnSave) {
        payload = payload.getUpdatedParent();
      }

      if (payload.id) {
        this.transactionService.update(payload).subscribe((transaction) => {
          navigationEvent.transaction = !transactionType.updateParentOnSave ? transaction : originalTransaction;
          this.navigateTo(navigationEvent);
        });
      } else {
        this.transactionService.create(payload).subscribe((transaction) => {
          navigationEvent.transaction = !transactionType.updateParentOnSave ? transaction : originalTransaction;
          this.navigateTo(navigationEvent);
        });
      }
    }
  }

  getNavigationControls(): TransactionNavigationControls {
    return this.transaction?.transactionType?.navigationControls || new TransactionNavigationControls([], [], []);
  }

  getInlineControls(): NavigationControl[] {
    return this.getNavigationControls().getNavigationControls('inline', this.transaction);
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    if (navigationEvent.action === NavigationAction.SAVE) {
      this.save(navigationEvent);
    } else {
      this.navigateTo(navigationEvent);
    }
  }

  navigateTo(event: NavigationEvent) {
    const reportPath = `/transactions/report/${event.transaction?.report_id}`;
    if (event.destination === NavigationDestination.ANOTHER) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      this.resetForm();
    } else if (event.destination === NavigationDestination.CHILD) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `${reportPath}/list/edit/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`
      );
    } else if (event.destination === NavigationDestination.PARENT) {
      this.router.navigateByUrl(`${reportPath}/list/edit/${event.transaction?.parent_transaction_id}`);
    } else {
      this.router.navigateByUrl(`${reportPath}/list`);
    }
  }

  resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transaction, this.contactTypeOptions);
  }

  isMemoCodeReadOnly(transactionType?: TransactionType): boolean {
    // Memo Code is read-only if there is a constant value in the schema.  Otherwise, it's mutable
    return TransactionFormUtils.getMemoCodeConstant(transactionType) !== undefined;
  }

  isDescriptionSystemGenerated(transactionType?: TransactionType): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return transactionType?.generatePurposeDescription !== undefined;
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(selectItem, this.form, this.transaction, this.contactId$);
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
  }

  createSubTransaction(event: { value: ScheduleTransactionTypes }) {
    this.save(new NavigationEvent(NavigationAction.SAVE, NavigationDestination.CHILD, this.transaction, event.value));
    this.form.get('subTransaction')?.reset(); // If the save fails, this clears the dropdown
  }
}
