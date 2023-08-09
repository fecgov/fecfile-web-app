import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationAction, NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { SelectItem } from 'primeng/api';
import { BehaviorSubject, Subject, concat, of, reduce, takeUntil } from 'rxjs';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
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
export abstract class TripleTransactionTypeBaseComponent
  extends DoubleTransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  childFormProperties_2: string[] = [];
  childTransactionType_2?: TransactionType;
  childTransaction_2?: Transaction;
  childContactTypeOptions_2: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm_2: FormGroup = this.fb.group({});
  childContactId_2$: Subject<string> = new BehaviorSubject<string>('');
  childTemplateMap_2: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  childMemoCodeCheckboxLabel_2$ = of('');

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    this.childTransaction_2 = this.transaction?.children?.filter(
      (child) =>
        child.transaction_type_identifier === this.transaction?.transactionType?.dependentChildTransactionTypes?.[1]
    )[0];
    if (!this.childTransaction_2) {
      throw new Error('Fecfile: Child 2 transaction not found for component');
    }
    this.childTransactionType_2 = this.childTransaction_2?.transactionType;
    if (!this.childTransactionType_2?.templateMap) {
      throw new Error('Fecfile: Template map not found for double transaction component');
    }
    this.childTemplateMap_2 = this.childTransactionType_2.templateMap;
    this.childContactTypeOptions_2 = getContactTypeOptions(this.childTransactionType_2.contactTypeOptions ?? []);
    this.childFormProperties_2 = this.childTransactionType_2.getFormControlNames();
    this.childForm_2 = this.fb.group(ValidateUtils.getFormGroupFields(this.childFormProperties_2));

    if (
      this.childTransactionType_2?.inheritedFields?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.childMemoCodeCheckboxLabel_2$ = this.memoCodeCheckboxLabel$;
    } else {
      this.childMemoCodeCheckboxLabel_2$ = this.getMemoCodeCheckboxLabel$(
        this.childForm_2,
        this.childTransactionType_2
      );
    }

    TransactionFormUtils.onInit(this, this.childForm_2, this.childTransaction_2, this.childContactId_2$);
    TransactionChildFormUtils.childOnInit(this, this.childForm_2, this.childTransaction_2);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    this.childContactId_2$.complete();
  }

  override save(navigationEvent: NavigationEvent) {
    // update all contacts with changes from form.
    if (this.transaction && this.childTransaction && this.childTransaction_2) {
      TransactionContactUtils.updateContactsWithForm(this.transaction, this.templateMap, this.form);
      TransactionContactUtils.updateContactsWithForm(this.childTransaction, this.childTemplateMap, this.childForm);
      TransactionContactUtils.updateContactsWithForm(
        this.childTransaction_2,
        this.childTemplateMap_2,
        this.childForm_2
      );
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
      TransactionFormUtils.getPayloadTransaction(this.childTransaction_2, this.childForm_2, this.childFormProperties_2),
    ];
    payload.children[0].report_id = payload.report_id;
    payload.children[1].report_id = payload.report_id;

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
      if (
        this.form.invalid ||
        this.childForm.invalid ||
        this.childForm_2.invalid ||
        !this.transaction ||
        !this.childTransaction ||
        !this.childTransactionType_2
      ) {
        return;
      }
      let confirmation$ = this.confirmWithUser(this.transaction, this.form);
      if (!this.childTransactionType?.useParentContact) {
        confirmation$ = concat(
          confirmation$,
          this.confirmWithUser(this.childTransaction, this.childForm, 'childDialog')
        ).pipe(reduce((accumulator, confirmed) => accumulator && confirmed));
      }
      if (this.childTransaction_2 && !this.childTransactionType_2?.useParentContact) {
        confirmation$ = concat(
          confirmation$,
          this.confirmWithUser(this.childTransaction_2, this.childForm_2, 'childDialog_2')
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
    TransactionFormUtils.resetForm(this.childForm_2, this.childTransaction_2, this.childContactTypeOptions_2);
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    if (this.childTransaction_2?.transactionType?.useParentContact && this.transaction?.contact_1) {
      this.childTransaction_2.contact_1 = this.transaction.contact_1;
      this.childForm_2.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactId_2$
    );

    if (this.childTransaction_2) {
      this.updateInheritedFields(this.childForm_2, this.childTransaction_2);
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }

  childUpdateFormWithCandidateContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(selectItem, this.childForm_2, this.childTransaction_2);
  }

  childUpdateFormWithSecondaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(selectItem, this.childForm_2, this.childTransaction_2);
  }
}
