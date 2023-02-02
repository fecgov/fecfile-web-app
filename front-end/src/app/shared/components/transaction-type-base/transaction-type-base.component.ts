import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
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
  @Input() transactionType: TransactionType | undefined;

  abstract formProperties: string[];
  ContactTypes = ContactTypes;
  contactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  contactId$: Subject<string> = new BehaviorSubject<string>('');
  formSubmitted = false;
  memoItemHelpText = 'The dollar amount in a memo item is not incorporated into the total figure for the schedule.';
  contributionPurposeDescriptionLabel = '';
  childTransactionOptions: { [key: string]: string | ScheduleATransactionTypes }[] = [];
  negativeAmountValueOnly = false;

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
    TransactionFormUtils.onInit(this, this.form, this.validateService, this.transactionType, this.contactId$);
    this.parentOnInit();
  }

  parentOnInit() {
    // Override contact type options if present in transactionType
    if (this.transactionType && this.transactionType.contactTypeOptions) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, this.transactionType.contactTypeOptions);
    }

    const contribution_amount_schema = this.transactionType?.schema.properties['contribution_amount'];
    if (contribution_amount_schema?.exclusiveMaximum === 0) {
      this.negativeAmountValueOnly = true;
      this.form
        .get('contribution_amount')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((contribution_amount) => {
          if (typeof contribution_amount === 'number' && contribution_amount > 0) {
            this.form.patchValue({ contribution_amount: -1 * contribution_amount });
          }
        });
    }

    if (this.transactionType?.generatePurposeDescriptionLabel) {
      this.contributionPurposeDescriptionLabel = this.transactionType.generatePurposeDescriptionLabel();
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
      this.transactionType,
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
    if (confirmTransaction.contact_id && confirmTransaction.contact) {
      const transactionContactChanges = TransactionContactUtils.setTransactionContactFormChanges(
        form,
        confirmTransaction.contact
      );
      if (transactionContactChanges?.length) {
        const confirmationMessage = TransactionContactUtils.getEditTransactionContactConfirmationMessage(
          transactionContactChanges,
          confirmTransaction.contact,
          form,
          this.fecDatePipe
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
      const confirmationMessage = TransactionContactUtils.getCreateTransactionContactConfirmationMessage(
        (confirmTransaction as SchATransaction).entity_type as ContactTypes,
        form
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
    }
  }

  protected doSave(navigationEvent: NavigationEvent, payload: Transaction) {
    if (payload.transaction_type_identifier) {
      let originalTransaction = payload;
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
    return this.transactionType?.navigationControls || new TransactionNavigationControls([], [], []);
  }

  getInlineControls(): NavigationControl[] {
    return this.getNavigationControls().getNavigationControls('inline', this.transactionType?.transaction);
  }

  handleNavigate(navigationEvent: NavigationEvent): void {
    if (navigationEvent.action === NavigationAction.SAVE) {
      this.save(navigationEvent);
    } else {
      this.navigateTo(navigationEvent);
    }
  }

  navigateTo(event: NavigationEvent) {
    let reportPath = `/transactions/report/${event.transaction?.report_id}`;
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
    TransactionFormUtils.resetForm(this.form, this.transactionType, this.contactTypeOptions);
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
    TransactionContactUtils.onContactLookupSelect(selectItem, this.form, this.transactionType, this.contactId$);
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
  }

  createSubTransaction(event: { value: ScheduleATransactionTypes }) {
    this.save(
      new NavigationEvent(
        NavigationAction.SAVE,
        NavigationDestination.CHILD,
        this.transactionType?.transaction,
        event.value
      )
    );
    this.form.get('subTransaction')?.reset(); // If the save fails, this clears the dropdown
  }
}
