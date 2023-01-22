import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionContactUtils } from './transaction-contact.utils';

/**
 * This component is to help manage a form that contains 2 transactions that the
 * user needs to fill out and submit to the back end.
 *
 * The primany transaction code is inherited from the TransactionTypeBaseComponent. This
 * abstract component class adds a child transaction that is defined in the parent
 * transaction's TransactionType class. (e.g. TransactionType.childTransactionType)
 *
 * See the transaction-group-ag component for an example of how to implement a
 * two-transaction input form.
 */
@Component({
  template: '',
})
export abstract class DoubleTransactionTypeBaseComponent
  extends TransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  abstract childFormProperties: string[];
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childValidateService: ValidateService = new ValidateService();
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childContributionPurposeDescriptionLabel = '';
  childNegativeAmountValueOnly = false;

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(this.childValidateService.getFormGroupFields(this.childFormProperties));
    TransactionFormUtils.onInit(
      this,
      this.childForm,
      this.childValidateService,
      this.transactionType?.childTransactionType,
      this.childContactId$
    );

    this.childOnInit();
  }

  childOnInit() {
    // Override contact type options if present in transactionType
    if (this.transactionType?.childTransactionType && this.transactionType.childTransactionType.contactTypeOptions) {
      this.childContactTypeOptions = LabelUtils.getPrimeOptions(
        ContactTypeLabels,
        this.transactionType.childTransactionType.contactTypeOptions
      );
    }

    const contribution_amount_schema =
      this.transactionType?.childTransactionType?.schema.properties['contribution_amount'];
    if (contribution_amount_schema?.exclusiveMaximum === 0) {
      this.childNegativeAmountValueOnly = true;
      this.childForm
        .get('contribution_amount')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe((contribution_amount) => {
          if (typeof contribution_amount === 'number' && contribution_amount > 0) {
            this.childForm.patchValue({ contribution_amount: -1 * contribution_amount });
          }
        });
    }

    if (this.transactionType?.childTransactionType?.generatePurposeDescriptionLabel) {
      this.childContributionPurposeDescriptionLabel =
        this.transactionType.childTransactionType.generatePurposeDescriptionLabel();
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  override save(navigateTo: NavigationDestination, transactionTypeToAdd?: ScheduleATransactionTypes) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transactionType,
      this.validateService,
      this.form,
      this.formProperties
    );
    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.transactionType?.childTransactionType,
        this.childValidateService,
        this.childForm,
        this.childFormProperties
      ),
    ];
    payload.children[0].report_id = payload.report_id;

    // Confirm transaction from Group A
    this.confirmSave(payload, this.form, this.childConfirmSave, navigateTo, payload, transactionTypeToAdd);
  }

  private childConfirmSave(
    navigateTo: NavigationDestination,
    payload: Transaction,
    transactionTypeToAdd?: ScheduleATransactionTypes
  ) {
    if (payload.children?.length === 1) {
      this.confirmSave(
        payload.children[0],
        this.childForm,
        this.doSave,
        navigateTo,
        payload,
        transactionTypeToAdd,
        'childDialog'
      );
    } else {
      throw new Error('Parent transaction missing child transaction when trying to confirm save.');
    }
  }

  override resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transactionType, this.contactTypeOptions);
    TransactionFormUtils.resetForm(
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactTypeOptions
    );
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactId$
    );
  }
}
