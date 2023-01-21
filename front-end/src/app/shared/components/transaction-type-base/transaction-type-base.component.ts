import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { TransactionType } from 'app/shared/models/transaction-types/transaction-type.model';
import { MemoText } from 'app/shared/models/memo-text.model';
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
import { BehaviorSubject, combineLatestWith, Observable, of, startWith, Subject, switchMap, takeUntil } from 'rxjs';
import { Contact, ContactFields, ContactTypeLabels, ContactTypes } from '../../models/contact.model';
import { FormBehaviors } from './form.behaviors';
import { ContactBehaviors } from './contact.behaviors';
import { MemoBehaviors } from './memo.behaviors';

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
    protected transactionService: TransactionService,
    protected contactService: ContactService,
    protected validateService: ValidateService,
    protected confirmationService: ConfirmationService,
    protected fb: FormBuilder,
    protected router: Router,
    protected fecDatePipe: FecDatePipe
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group(this.validateService.getFormGroupFields(this.formProperties));
    FormBehaviors.onInit(
      this.form,
      this.validateService,
      this.transactionType,
      this.contactId$,
      this.contributionPurposeDescriptionLabel
    );
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

    const payload: Transaction = FormBehaviors.getPayloadTransaction(
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
      const transactionContactChanges = ContactBehaviors.setTransactionContactFormChanges(
        form,
        confirmTransaction.contact
      );
      if (transactionContactChanges?.length) {
        const confirmationMessage = ContactBehaviors.getEditTransactionContactConfirmationMessage(
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
      const confirmationMessage = ContactBehaviors.getCreateTransactionContactConfirmationMessage(
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
        `/transactions/report/${this.transactionType?.transaction?.report_id}/list/edit/${this.transactionType?.transaction?.parent_transaction_object_id}`
      );
    } else {
      this.router.navigateByUrl(`/transactions/report/${this.transactionType?.transaction?.report_id}/list`);
    }
  }

  protected resetForm() {
    FormBehaviors.resetForm(this.form, this.transactionType);
  }

  isMemoCodeReadOnly(transactionType?: TransactionType): boolean {
    // Memo Code is read-only if there is a constant value in the schema.  Otherwise, it's mutable
    return FormBehaviors.getMemoCodeConstant(transactionType) !== undefined;
  }

  isDescriptionSystemGenerated(transactionType?: TransactionType): boolean {
    // Description is system generated if there is a defined function.  Otherwise, it's mutable
    return transactionType?.generatePurposeDescription !== undefined;
  }

  onContactLookupSelect(selectItem: SelectItem<Contact>) {
    ContactBehaviors.onContactLookupSelect(selectItem, this.form, this.transactionType, this.contactId$);
  }

  getEntityType(): string {
    return this.form.get('entity_type')?.value || '';
  }
}
