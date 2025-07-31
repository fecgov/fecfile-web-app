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
import { of } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { TransactionChildFormUtils } from './transaction-child-form.utils';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { blurActiveInput } from 'app/shared/utils/form.utils';

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
  childForm_2: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  childContactIdMap_2: ContactIdMapType = {};
  childTemplateMap_2: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  memoHasOptional_2$ = of(false);

  override ngOnInit(): void {
    // Initialize primary and secondary forms.
    super.ngOnInit();

    // Initialize child form.
    if (this.transaction) {
      this.childTransaction_2 = this.getChildTransaction(this.transaction, 1);
    } else {
      throw new Error('FECfile+: Transaction not found for triple-entry transaction form');
    }
    if (!this.childTransaction_2) {
      throw new Error('FECfile+: Child 2 transaction not found for triple-entry transaction form');
    }
    this.childTransactionType_2 = this.childTransaction_2?.transactionType;
    if (!this.childTransactionType_2?.templateMap) {
      throw new Error('FECfile+: Template map not found for triple transaction triple-entry transaction form');
    }
    this.childTemplateMap_2 = this.childTransactionType_2.templateMap;
    this.childContactTypeOptions_2 = getContactTypeOptions(this.childTransactionType_2.contactTypeOptions ?? []);
    this.childFormProperties_2 = this.childTransactionType_2.getFormControlNames();
    this.childForm_2 = this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(this.childFormProperties_2, this.childTransactionType_2.schema),
      {
        updateOn: 'blur',
      },
    );

    if (
      this.childTransactionType_2
        ?.getInheritedFields(this.childTransaction_2)
        ?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.memoHasOptional_2$ = this.memoHasOptional$;
    } else {
      this.memoHasOptional_2$ = this.getMemoHasOptional$(this.childForm_2, this.childTransactionType_2);
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

  override async save(navigationEvent: NavigationEvent): Promise<void> {
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
      throw new Error('FECfile+: No transactions submitted for triple-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction,
      this.activeReportId,
      this.form,
      this.formProperties,
    );

    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction,
        this.activeReportId,
        this.childForm,
        this.childFormProperties,
      ),
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction_2,
        this.activeReportId,
        this.childForm_2,
        this.childFormProperties_2,
      ),
    ];
    payload.children[0].report_ids = payload.report_ids;
    payload.children[1].report_ids = payload.report_ids;

    return this.processPayload(payload, navigationEvent);
  }

  override isInvalid(): boolean {
    blurActiveInput(this.childForm_2);
    return super.isInvalid() || this.childForm_2.invalid || !this.childTransaction_2;
  }

  override async getConfirmations(): Promise<boolean> {
    if (!this.childTransaction_2) return false;
    const result = await super.getConfirmations();
    if (!result) return false;
    return this.confirmationService.confirmWithUser(
      this.childForm_2,
      this.childTransaction_2.transactionType?.contactConfig ?? {},
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
      'childDialog_2',
      this.childTransaction_2,
    );
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(
      this.childForm_2,
      this.childTransaction_2,
      this.childContactTypeOptions_2,
      this.committeeAccount(),
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
      throw new Error('FECfile+: Missing child transaction.');
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
