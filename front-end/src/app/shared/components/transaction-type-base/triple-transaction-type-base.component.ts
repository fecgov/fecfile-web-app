import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType,
} from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SelectItem } from 'primeng/api';
import { concat, Observable, of, reduce } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TransactionChildFormUtils } from './transaction-child-form.utils';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';

/**
 * This component is to help manage a form that contains 3 transactions that the
 * user needs to fill out and submit to the back end.
 *
 * The primany transaction code is inherited from the TransactionTypeBaseComponent and
 * the secondary transaction code is inherited from the DoubleTransactionTypeBaseComponent
 * in turn. This abstract component class adds a child_2 transaction that is defined in the parent
 * transaction's TransactionType class.
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
  childContactIdMap_2: ContactIdMapType = {};
  childTemplateMap_2: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  childMemoCodeCheckboxLabel_2$ = of('');

  override ngOnInit(): void {
    // Initialize primary and secondary forms.
    super.ngOnInit();

    // Initialize child form.
    if (this.transaction) {
      this.childTransaction_2 = this.getChildTransaction(this.transaction, 1);
    } else {
      throw new Error('Fecfile: Transaction not found for triple-entry transaction form');
    }
    if (!this.childTransaction_2) {
      throw new Error('Fecfile: Child 2 transaction not found for triple-entry transaction form');
    }
    this.childTransactionType_2 = this.childTransaction_2?.transactionType;
    if (!this.childTransactionType_2?.templateMap) {
      throw new Error('Fecfile: Template map not found for triple transaction triple-entry transaction form');
    }
    this.childTemplateMap_2 = this.childTransactionType_2.templateMap;
    this.childContactTypeOptions_2 = getContactTypeOptions(this.childTransactionType_2.contactTypeOptions ?? []);
    this.childFormProperties_2 = this.childTransactionType_2.getFormControlNames();
    this.childForm_2 = this.fb.group(SchemaUtils.getFormGroupFields(this.childFormProperties_2));

    if (
      this.childTransactionType_2
        ?.getInheritedFields(this.childTransaction_2)
        ?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.childMemoCodeCheckboxLabel_2$ = this.memoCodeCheckboxLabel$;
    } else {
      this.childMemoCodeCheckboxLabel_2$ = this.getMemoCodeCheckboxLabel$(
        this.childForm_2,
        this.childTransactionType_2,
      );
    }

    TransactionFormUtils.onInit(
      this,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactIdMap_2,
      this.contactService,
    );
    TransactionChildFormUtils.childOnInit(this, this.childForm_2, this.childTransaction_2);
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    Object.values(this.childContactIdMap_2).forEach((id$) => id$.complete());
  }

  override save(navigationEvent: NavigationEvent) {
    // update all contacts with changes from form.
    if (this.transaction && this.childTransaction && this.childTransaction_2) {
      TransactionContactUtils.updateContactsWithForm(this.transaction, this.templateMap, this.form);
      TransactionContactUtils.updateContactsWithForm(this.childTransaction, this.childTemplateMap, this.childForm);
      TransactionContactUtils.updateContactsWithForm(
        this.childTransaction_2,
        this.childTemplateMap_2,
        this.childForm_2,
      );
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('Fecfile: No transactions submitted for triple-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.form,
      this.formProperties,
    );

    payload.children = [
      TransactionFormUtils.getPayloadTransaction(this.childTransaction, this.childForm, this.childFormProperties),
      TransactionFormUtils.getPayloadTransaction(this.childTransaction_2, this.childForm_2, this.childFormProperties_2),
    ];
    payload.children[0].report_ids = payload.report_ids;
    payload.children[1].report_ids = payload.report_ids;

    this.processPayload(payload, navigationEvent);
  }

  override isInvalid(): boolean {
    return super.isInvalid() || this.childForm_2.invalid || !this.childTransaction_2;
  }

  override get confirmation$(): Observable<boolean> {
    if (!this.childTransaction_2) return of(false);
    return concat(
      super.confirmation$,
      this.confirmWithUser(this.childTransaction_2, this.childForm_2, 'childDialog_2'),
    ).pipe(reduce((accumulator, confirmed) => accumulator && confirmed));
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(
      this.childForm_2,
      this.childTransaction_2,
      this.childContactTypeOptions_2,
      this.committeeAccount,
    );
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    if (
      this.childTransaction_2?.transactionType?.getUseParentContact(this.childTransaction_2) &&
      this.transaction?.contact_1
    ) {
      this.childTransaction_2.contact_1 = this.transaction.contact_1;
      this.childForm_2.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactIdMap_2['contact_1'],
    );

    if (this.childTransaction_2) {
      this.updateInheritedFields(this.childForm_2, this.childTransaction_2);
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }

  childUpdateFormWithCandidateContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactIdMap_2['contact_2'],
    );
  }

  childUpdateFormWithSecondaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactIdMap_2['contact_2'],
    );
  }

  childUpdateFormWithTertiaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactIdMap_2['contact_3'],
    );
  }
}
