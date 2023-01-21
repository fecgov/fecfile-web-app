import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { NavigationDestination } from 'app/shared/models/transaction-navigation-controls.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { ValidateService } from 'app/shared/services/validate.service';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject } from 'rxjs';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionTypeBaseComponent } from '../transaction-type-base/transaction-type-base.component';
import { FormBehaviors } from './form.behaviors';
import { ContactBehaviors } from './contact.behaviors';

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
  childContributionPurposeDescriptionLabel = '';
  childNegativeAmountValueOnly = false;

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childForm = this.fb.group(this.childValidateService.getFormGroupFields(this.childFormProperties));
    FormBehaviors.onInit(
      this.childForm,
      this.childValidateService,
      this.transactionType?.childTransactionType,
      this.childContactId$,
      this.childContributionPurposeDescriptionLabel
    );
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

    const payload: Transaction = FormBehaviors.getPayloadTransaction(
      this.transactionType,
      this.validateService,
      this.form,
      this.formProperties
    );
    payload.children = [
      FormBehaviors.getPayloadTransaction(
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

  protected override resetForm() {
    FormBehaviors.resetForm(this.form, this.transactionType);
    FormBehaviors.resetForm(this.childForm, this.transactionType?.childTransactionType);
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    ContactBehaviors.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.transactionType?.childTransactionType,
      this.childContactId$
    );
  }
}
