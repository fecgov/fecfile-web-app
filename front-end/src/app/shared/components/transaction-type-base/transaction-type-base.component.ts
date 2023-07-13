import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  GO_BACK_CONTROL,
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  NavigationEvent,
  TransactionNavigationControls
} from 'app/shared/models/transaction-navigation-controls.model';
import { TransactionTemplateMapType, TransactionType } from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { ReportService } from 'app/shared/services/report.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
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
  candidateContactTypeFormControl: FormControl = new FormControl(ContactTypes.CANDIDATE); // eslint-disable-next-line @typescript-eslint/no-unused-vars
  candidateContactTypeOption: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels, [ContactTypes.CANDIDATE]);
  stateOptions: PrimeOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  destroy$: Subject<boolean> = new Subject<boolean>();
  contactId$: Subject<string> = new BehaviorSubject<string>('');
  formSubmitted = false;
  purposeDescriptionLabel = '';
  templateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  form: FormGroup = this.fb.group({});
  isEditable = true;

  constructor(
    protected messageService: MessageService,
    public transactionService: TransactionService,
    protected contactService: ContactService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe,
    protected store: Store,
    protected reportService: ReportService
  ) { }

  ngOnInit(): void {
    const fields = ValidateUtils.getFormGroupFields(this.formProperties);
    fields['contact_1'] = [''];
    fields['contact_2'] = ['', () => {
      if ((!this.form.get('contact_2')?.value) &&
        this.transaction?.transactionType?.contact2IsRequired) {
        return { required: true };
      }
      return null;
    }];
    this.form = this.fb.group(fields);
    if (this.transaction?.transactionType?.templateMap) {
      this.templateMap = this.transaction.transactionType.templateMap;
    } else {
      throw new Error('Fecfile: Template map not found for transaction component');
    }
    TransactionFormUtils.onInit(this, this.form, this.transaction, this.contactId$);
    this.parentOnInit();
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.isEditable = this.reportService.isEditable(report);
        if (!this.isEditable) this.form.disable();
      });
  }

  parentOnInit() {
    // Override contact type options if present in transactionType
    if (this.transaction?.transactionType?.contactTypeOptions) {
      this.contactTypeOptions = LabelUtils.getPrimeOptions(
        ContactTypeLabels,
        this.transaction.transactionType.contactTypeOptions
      );
    }

    // Determine if amount should always be negative and then force it to be so if needed
    if (this.transaction?.transactionType?.negativeAmountValueOnly && this.templateMap?.amount) {
      this.form
        .get(this.templateMap.amount)
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((amount) => {
          if (+amount > 0) {
            this.form.patchValue({ [this.templateMap.amount]: -1 * amount });
          }
        });
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
      confirmTransaction.contact_1_id &&
      confirmTransaction.contact_1 &&
      confirmTransaction?.transactionType?.templateMap
    ) {
      const transactionContactChanges = TransactionContactUtils.setTransactionContactFormChanges(
        form,
        confirmTransaction.contact_1,
        confirmTransaction.transactionType.templateMap
      );
      if (transactionContactChanges?.length) {
        const confirmationMessage = TransactionContactUtils.getEditTransactionContactConfirmationMessage(
          transactionContactChanges,
          confirmTransaction.contact_1,
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
        throw new Error('Fecfile: Cannot find template map when confirming transaction');
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
      if (payload.transactionType?.updateParentOnSave) {
        payload = payload.getUpdatedParent();
      }

      if (payload.id) {
        this.transactionService.update(payload).subscribe((transaction) => {
          navigationEvent.transaction = originalTransaction.transactionType?.updateParentOnSave
            ? originalTransaction
            : transaction;
          this.navigateTo(navigationEvent);
        });
      } else {
        this.transactionService.create(payload).subscribe((transaction) => {
          navigationEvent.transaction = originalTransaction.transactionType?.updateParentOnSave
            ? originalTransaction
            : transaction;
          this.navigateTo(navigationEvent);
        });
      }
    }
  }

  getNavigationControls(): TransactionNavigationControls {
    if (!this.isEditable) return new TransactionNavigationControls([], [GO_BACK_CONTROL], []);
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
    const reportPath = `/reports/transactions/report/${event.transaction?.report_id}`;
    if (
      event.destination === NavigationDestination.ANOTHER ||
      event.destination === NavigationDestination.ANOTHER_CHILD
    ) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      if (event.transaction?.parent_transaction_id) {
        this.router.navigateByUrl(
          `${reportPath}/list/${event.transaction?.parent_transaction_id}/create-sub-transaction/${event.destinationTransactionType}`
        );
        this.resetForm();
      } else {
        this.router.navigateByUrl(`${reportPath}/create/${event.destinationTransactionType}`);
        this.resetForm();
      }
    } else if (event.destination === NavigationDestination.CHILD) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `${reportPath}/list/${event.transaction?.id}/create-sub-transaction/${event.destinationTransactionType}`
      );
    } else if (event.destination === NavigationDestination.PARENT) {
      this.router.navigateByUrl(`${reportPath}/list/${event.transaction?.parent_transaction_id}`);
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
  onSecondaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.form, this.transaction);
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
  }
}
