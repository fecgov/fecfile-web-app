import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { SchATransaction, ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { Contact, ContactTypes, ContactTypeLabels } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from '../transaction-type-base/transaction-type-base.component';

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
export abstract class TransactionTypeX2BaseComponent extends TransactionTypeBaseComponent implements OnInit, OnDestroy {
  abstract childFormProperties: string[];
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childValidateService: ValidateService = new ValidateService();
  childContactId$: Subject<string> = new BehaviorSubject<string>('');

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(this.childValidateService.getFormGroupFields(this.childFormProperties));
    this.doInit(
      this.childForm,
      this.childValidateService,
      this.transactionType?.childTransactionType,
      this.childContactId$
    );

    // Default the child entity type to Committee
    if (!this.transactionType?.childTransactionType?.transaction?.id) {
      this.childForm.get('entity_type')?.setValue(ContactTypes.COMMITTEE);
    }

    // Parent contribution purpose description updates with child contributor name updates.
    this.childForm
      .get('contributor_organization_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const childTransaction: SchATransaction = this.transactionType?.childTransactionType
          ?.transaction as SchATransaction;
        childTransaction.contributor_organization_name = value;
        this.updateContributionPurposeDescription();
      });
    this.childForm
      .get('contributor_first_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const memo: SchATransaction = this.transactionType?.childTransactionType?.transaction as SchATransaction;
        if (memo) {
          memo.contributor_first_name = value;
        }
        this.updateContributionPurposeDescription();
      });
    this.childForm
      .get('contributor_last_name')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        const memo: SchATransaction = this.transactionType?.childTransactionType?.transaction as SchATransaction;
        if (memo) {
          memo.contributor_last_name = value;
        }
        this.updateContributionPurposeDescription();
      });

    // Child amount must match parent contribution amount
    this.form
      .get('contribution_amount')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.childForm.get('contribution_amount')?.setValue(value);
      });
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  updateContributionPurposeDescription() {
    const childTransaction: SchATransaction = this.transactionType?.childTransactionType
      ?.transaction as SchATransaction;
    childTransaction.entity_type = this.childForm.get('entity_type')?.value;

    if (this.transactionType?.generatePurposeDescription) {
      this.form.patchValue({
        contribution_purpose_descrip: this.transactionType.generatePurposeDescription(),
      });
    }
  }

  override save(navigateTo: NavigationDestination, transactionTypeToAdd?: ScheduleATransactionTypes) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    const payload: Transaction = this.getPayloadTransaction(
      this.transactionType,
      this.validateService,
      this.form,
      this.formProperties
    );
    payload.children = [
      this.getPayloadTransaction(
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
      // Confirm transaction from Group G
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
      throw new Error('Transaction missing child transaction when trying to confirm save.');
    }
  }

  protected override resetForm() {
    this.doResetForm(this.form, this.transactionType);
    this.doResetForm(this.childForm, this.transactionType?.childTransactionType);
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    this.doContactLookupSelect(
      selectItem,
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactId$
    );
  }
}
