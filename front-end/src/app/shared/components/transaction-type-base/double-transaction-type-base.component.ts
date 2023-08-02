import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { ScheduleTransaction, Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, of, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { TransactionChildFormUtils } from './transaction-child-form.utils';

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
  childFormProperties: string[] = [];
  childTransactionType?: TransactionType;
  childTransaction?: Transaction;
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childContactId$: Subject<string> = new BehaviorSubject<string>('');
  childTemplateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  childMemoCodeCheckboxLabel$ = of('');

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childTransaction = (this.transaction?.children ?? [])[0];
    this.childTransactionType = this.childTransaction?.transactionType;
    if (!this.childTransactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for double transaction component');
    }
    this.childTemplateMap = this.childTransactionType.templateMap;
    this.childContactTypeOptions = getContactTypeOptions(this.childTransactionType.contactTypeOptions ?? []);
    this.childFormProperties = this.childTransactionType.getFormControlNames(this.childTemplateMap);
    this.childForm = this.fb.group(ValidateUtils.getFormGroupFields(this.childFormProperties));

    if (
      this.childTransactionType?.inheritedFields?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.childMemoCodeCheckboxLabel$ = this.memoCodeCheckboxLabel$;
    } else {
      this.childMemoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(this.childForm, this.childTransactionType);
    }

    TransactionFormUtils.onInit(this, this.childForm, this.childTransaction, this.childContactId$);
    TransactionChildFormUtils.childOnInit(this, this.childForm, this.childTransaction);
  }

  override onContactLookupSelect(selectItem: SelectItem<Contact>): void {
    super.onContactLookupSelect(selectItem);
    if (
      this.childTransaction?.transactionType?.useParentContact &&
      this.childTransaction &&
      this.transaction?.contact_1
    ) {
      this.childTransaction.contact_1 = this.transaction.contact_1;
      this.childForm.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  private updateParentPurposeDescription() {
    if (this.transaction?.transactionType?.generatePurposeDescription) {
      this.form.patchValue({
        [this.templateMap.purpose_description]: this.transaction.transactionType.generatePurposeDescriptionWrapper(
          this.transaction
        ),
      });
    }
  }

  private updateChildPurposeDescription() {
    if (this.childTransaction?.transactionType?.generatePurposeDescription) {
      this.childForm.patchValue({
        [this.childTemplateMap.purpose_description]: this.childTransactionType?.generatePurposeDescriptionWrapper(
          this.childTransaction
        ),
      });
    }
  }

  override save(navigationEvent: NavigationEvent) {
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid) {
      return;
    }

    // Remove parent transaction links within the parent-child hierarchy in the
    // transaction objects to avoid a recursion overflow from the class-transformer
    // plainToClass() converter.
    if (this.transaction?.children) {
      this.transaction.children[0].parent_transaction = undefined;
    }
    if (this.childTransaction?.parent_transaction) {
      this.childTransaction.parent_transaction = undefined;
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.form,
      this.formProperties
    );
    payload.children = [
      TransactionFormUtils.getPayloadTransaction(this.childTransaction, this.childForm, this.childFormProperties),
    ];
    payload.children[0].report_id = payload.report_id;

    // Confirm save for parent transaction
    // No need to confirm child contact changes if it uses the parent contact info
    const saveCallback = this.childTransactionType?.useParentContact ? this.doSave : this.childConfirmSave;
    this.confirmSave(payload, this.form, saveCallback, navigationEvent, payload);
  }

  private childConfirmSave(navigationEvent: NavigationEvent, payload: Transaction) {
    if (payload.children?.length === 1) {
      this.confirmSave(payload.children[0], this.childForm, this.doSave, navigationEvent, payload, 'childDialog');
    } else {
      throw new Error('Fecfile: Parent transaction missing child transaction when trying to confirm save.');
    }
  }

  override resetForm() {
    this.formSubmitted = false;
    TransactionFormUtils.resetForm(this.form, this.transaction, this.contactTypeOptions);
    TransactionFormUtils.resetForm(this.childForm, this.childTransaction, this.childContactTypeOptions);
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactId$
    );

    // Some inheritted fields (such as memo_code) cannot be set before the components are initialized.
    // This happens most reliably when the user selects a contact for the child transaction.
    // Afterwards, inheritted fields are updated to match parent values.
    this.childTransactionType?.inheritedFields?.forEach((inherittedField) => {
      const childFieldControl = this.childForm.get(this.childTemplateMap[inherittedField]);
      childFieldControl?.enable();
      const value = this.form.get(this.templateMap[inherittedField])?.value;
      if (value !== undefined) {
        childFieldControl?.setValue(value);
        childFieldControl?.updateValueAndValidity();
      }
      childFieldControl?.disable();
    });
  }

  childOnSecondaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.childForm, this.childTransaction);
  }
}
