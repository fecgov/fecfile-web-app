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
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TransactionChildFormUtils } from './transaction-child-form.utils';

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
    this.childTransaction_2 = (this.transaction?.children ?? [])[1];
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
    this.formSubmitted = true;

    if (this.form.invalid || this.childForm.invalid || this.childForm_2.invalid) {
      return;
    }

    // Remove parent transaction links within the parent-child hierarchy in the
    // transaction objects to avoid a recursion overflow from the class-transformer
    // plainToClass() converter.
    if (this.transaction?.children) {
      this.transaction.children[0].parent_transaction = undefined;
      this.transaction.children[1].parent_transaction = undefined;
    }
    if (this.childTransaction?.parent_transaction && this.childTransaction_2?.parent_transaction) {
      this.childTransaction.parent_transaction = undefined;
      this.childTransaction_2.parent_transaction = undefined;
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

    // Confirm save for parent transaction
    // No need to confirm child contact changes if it uses the parent contact info
    const saveCallback = this.childTransactionType_2?.useParentContact ? this.doSave : this.childConfirmSave_2;
    this.confirmSave(payload, this.form, saveCallback, navigationEvent, payload);
  }

  private childConfirmSave_2(navigationEvent: NavigationEvent, payload: Transaction) {
    if (payload.children?.length === 2) {
      this.confirmSave(payload.children[1], this.childForm_2, this.doSave, navigationEvent, payload, 'childDialog_2');
    } else {
      throw new Error('Fecfile: Parent transaction missing child_2 transaction when trying to confirm save.');
    }
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(this.childForm_2, this.childTransaction_2, this.childContactTypeOptions_2);
  }

  override onContactLookupSelect(selectItem: SelectItem<Contact>): void {
    super.onContactLookupSelect(selectItem);
    if (this.childTransaction_2?.transactionType?.useParentContact && this.transaction?.contact_1) {
      this.childTransaction_2.contact_1 = this.transaction.contact_1;
      this.childForm_2.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childOnContactLookupSelect_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onContactLookupSelect(
      selectItem,
      this.childForm_2,
      this.childTransaction_2,
      this.childContactId_2$
    );

    if (this.childTransaction_2) {
      this.updateInheritedFields(this.childForm_2, this.childTransaction_2);
    } else {
      throw new Error('Fecfile: Missing child_2 transaction.');
    }
  }

  childOnSecondaryContactLookupSelect_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.onSecondaryContactLookupSelect(selectItem, this.childForm_2, this.childTransaction_2);
  }
}
