import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { FecDatePipe } from 'app/shared/pipes/fec-date.pipe';
import { ContactService } from 'app/shared/services/contact.service';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ConfirmationService, MessageService, SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionContactUtils } from './transaction-contact.utils';

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

  save(navigateTo: NavigationDestination, transactionTypeToAdd?: ScheduleATransactionTypes) {
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

    this.confirmSave(payload, this.form, this.doSave, navigateTo, payload, transactionTypeToAdd);
  }

  protected confirmSave(
    confirmTransaction: Transaction,
    form: FormGroup,
    acceptCallback: (
      navigateTo: NavigationDestination,
      payload: Transaction,
      transactionTypeToAdd?: ScheduleATransactionTypes
    ) => void,
    navigateTo: NavigationDestination,
    payload: Transaction,
    transactionTypeToAdd?: ScheduleATransactionTypes,
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
            acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
          },
          reject: () => {
            return;
          },
        });
      } else {
        acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
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
          acceptCallback.call(this, navigateTo, payload, transactionTypeToAdd);
        },
        reject: () => {
          return;
        },
      });
    }
  }

  protected doSave(
    navigateTo: NavigationDestination,
    payload: Transaction,
    transactionTypeToAdd?: ScheduleATransactionTypes
  ) {
    if (payload.transaction_type_identifier) {
      if (payload.id) {
        this.transactionService.update(payload).subscribe((transaction) => {
          this.navigateTo(navigateTo, transaction.id, transactionTypeToAdd);
        });
      } else {
        this.transactionService.create(payload).subscribe((transaction) => {
          this.navigateTo(navigateTo, transaction.id, transactionTypeToAdd);
        });
      }
    }
  }

  getNavigationControls(): TransactionNavigationControls {
    return this.transactionType?.navigationControls || new TransactionNavigationControls([], [], []);
  }

  handleNavigate(navigationControl: NavigationControl): void {
    if (navigationControl.navigationAction === NavigationAction.SAVE) {
      this.save(navigationControl.navigationDestination);
    } else {
      this.navigateTo(navigationControl.navigationDestination);
    }
  }

  navigateTo(
    navigateTo: NavigationDestination,
    transactionId?: string,
    transactionTypeToAdd?: ScheduleATransactionTypes
  ) {
    if (navigateTo === NavigationDestination.ANOTHER) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Transaction Saved',
        life: 3000,
      });
      this.resetForm();
    } else if (navigateTo === NavigationDestination.CHILD) {
      this.messageService.add({
        severity: 'success',
        summary: 'Successful',
        detail: 'Parent Transaction Saved',
        life: 3000,
      });
      this.router.navigateByUrl(
        `/transactions/report/${this.transactionType?.transaction?.report_id}/list/edit/${transactionId}/create-sub-transaction/${transactionTypeToAdd}`
      );
    } else if (navigateTo === NavigationDestination.PARENT) {
      this.router.navigateByUrl(
        `/transactions/report/${this.transactionType?.transaction?.report_id}/list/edit/${this.transactionType?.transaction?.parent_transaction_id}`
      );
    } else {
      this.router.navigateByUrl(`/transactions/report/${this.transactionType?.transaction?.report_id}/list`);
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
}
