import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationAction, NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
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
import { BehaviorSubject, Subject, concat, of, reduce, takeUntil } from 'rxjs';
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
    this.childFormProperties = this.childTransactionType.getFormControlNames();
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

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId$.complete();
  }

  override save(navigationEvent: NavigationEvent) {
    // update all contacts with changes from form.
    if (this.transaction && this.childTransaction) {
      TransactionContactUtils.updateContactWithForm(this.transaction, this.templateMap, this.form);
      TransactionContactUtils.updateContactWithForm(this.childTransaction, this.childTemplateMap, this.childForm);
    } else {
      throw new Error('Fecfile: No transactions submitted for double-entry transaction form.');
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

    if (payload.transaction_type_identifier) {
      const responseFromApi = this.writeToApi(payload);
      responseFromApi.subscribe((transaction) => {
        navigationEvent.transaction = this.transactionType?.updateParentOnSave ? payload : transaction;
        this.navigateTo(navigationEvent);
      });
    }
  }

  override handleNavigate(navigationEvent: NavigationEvent): void {
    this.formSubmitted = true;

    if (navigationEvent.action === NavigationAction.SAVE) {
      if (this.childForm.invalid || this.form.invalid || !this.transaction || !this.childTransaction) {
        return;
      }
      let confirmation$ = this.confirmWithUser(this.transaction, this.form);
      if (!this.childTransactionType?.useParentContact) {
        confirmation$ = concat(
          confirmation$,
          this.confirmWithUser(this.childTransaction, this.childForm, 'childDialog')
        ).pipe(reduce((accumulator, confirmed) => accumulator && confirmed));
      }
      confirmation$.subscribe((confirmed: boolean) => {
        // if every confirmation was accepted
        if (confirmed) this.save(navigationEvent);
      });
    } else {
      this.navigateTo(navigationEvent);
    }
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(this.childForm, this.childTransaction, this.childContactTypeOptions);
  }

  override onContactLookupSelect(selectItem: SelectItem<Contact>): void {
    super.onContactLookupSelect(selectItem);
    if (this.childTransaction?.transactionType?.useParentContact && this.transaction?.contact_1) {
      this.childTransaction.contact_1 = this.transaction.contact_1;
      this.childForm.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childOnContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactId$
    );

    if (this.childTransaction) {
      this.updateInheritedFields(this.childForm, this.childTransaction);
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }

  protected updateInheritedFields(childForm: FormGroup, childTransaction: Transaction): void {
    // Some inheritted fields (such as memo_code) cannot be set before the components are initialized.
    // This happens most reliably when the user selects a contact for the child transaction.
    // Afterwards, inheritted fields are updated to match parent values.

    this.childTransactionType?.inheritedFields?.forEach((inherittedField) => {
      if (childTransaction.transactionType) {
        const childFieldControl = childForm.get(childTransaction.transactionType.templateMap[inherittedField]);
        childFieldControl?.enable();
        const value = this.form.get(this.templateMap[inherittedField])?.value;
        if (value !== undefined) {
          childFieldControl?.setValue(value);
          childFieldControl?.updateValueAndValidity();
        }
        childFieldControl?.disable();
      } else {
        throw new Error('Fecfile: Transaction missing transactionType.');
      }
    });
  }

  childOnSecondaryContactLookupSelect(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.childForm, this.childTransaction);
  }
}
