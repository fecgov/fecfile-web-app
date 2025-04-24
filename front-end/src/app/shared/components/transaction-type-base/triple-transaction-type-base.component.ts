import { Component, computed, OnInit } from '@angular/core';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { TemplateMapKeyType, TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SelectItem } from 'primeng/api';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact } from '../../models/contact.model';
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
export abstract class TripleTransactionTypeBaseComponent extends DoubleTransactionTypeBaseComponent implements OnInit {
  readonly childFormProperties_2 = computed(() => this.childTransactionType_2().getFormControlNames());
  readonly childTransactionType_2 = computed(() => this.childTransaction_2().transactionType);
  readonly childTransaction_2 = computed(() => this.getChildTransaction(this.transaction(), 1));
  readonly childContactTypeOptions_2 = computed(() =>
    getContactTypeOptions(this.childTransactionType_2().contactTypeOptions ?? []),
  );
  readonly childForm_2 = computed(() => {
    const props = this.childFormProperties_2();
    if (props.length < 1) return undefined;
    return this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(
        this.injector,
        this.childFormProperties_2(),
        this.childTransactionType_2().schema,
      ),
      {
        updateOn: 'blur',
      },
    );
  });
  childContactIdMap_2: ContactIdMapType = {};
  readonly childTemplateMap_2 = computed(
    () => this.childTransactionType_2().templateMap ?? ({} as TransactionTemplateMapType),
  );
  readonly childMemoCodeCheckboxLabel_2 = computed(() => {
    const childTrans2 = this.childTransaction_2();
    const childTransType2 = this.childTransactionType_2();
    if (!childTrans2 || !childTransType2) return '';
    if (
      childTransType2?.getInheritedFields(childTrans2)?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType()
    ) {
      return this.memoCodeCheckboxLabel();
    } else {
      return this.getMemoCodeCheckboxLabel(this.childForm_2()!, childTransType2);
    }
  });

  override ngOnInit() {
    super.ngOnInit();
    const form = this.childForm_2();
    const trans = this.childTransaction_2();
    if (!form || !trans) return;
    TransactionFormUtils.onInit(
      this,
      form,
      this.childTransaction_2(),
      this.childContactIdMap_2,
      this.contactService,
      this.injector,
    );
    TransactionChildFormUtils.childOnInit(this, form, trans, this.injector);
  }

  override async save(navigationEvent: NavigationEvent): Promise<void> {
    // update all contacts with changes from form.
    const transaction = this.transaction();
    const childTransaction = this.childTransaction();
    const childTransaction_2 = this.childTransaction_2();
    const templateMap = this.templateMap();
    const childTemplatMap = this.childTemplateMap();
    if (transaction && childTransaction && childTransaction_2 && templateMap && childTemplatMap) {
      TransactionContactUtils.updateContactsWithForm(transaction, templateMap, this.form());
      TransactionContactUtils.updateContactsWithForm(childTransaction, childTemplatMap, this.childForm());
      TransactionContactUtils.updateContactsWithForm(
        childTransaction_2,
        this.childTemplateMap_2(),
        this.childForm_2()!,
      );
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('Fecfile: No transactions submitted for triple-entry transaction form.');
    }

    const payload: Transaction = TransactionFormUtils.getPayloadTransaction(
      this.transaction(),
      this.activeReportId,
      this.form(),
      this.formProperties(),
    );

    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction(),
        this.activeReportId,
        this.childForm(),
        this.childFormProperties(),
      ),
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction_2(),
        this.activeReportId,
        this.childForm_2()!,
        this.childFormProperties_2(),
      ),
    ];
    payload.children[0].report_ids = payload.report_ids;
    payload.children[1].report_ids = payload.report_ids;

    return this.processPayload(payload, navigationEvent);
  }

  override isInvalid(): boolean {
    blurActiveInput(this.childForm_2()!);
    return super.isInvalid() || this.childForm_2()!.invalid || !this.childTransaction_2;
  }

  override async getConfirmations(): Promise<boolean> {
    if (!this.childTransaction_2) return false;
    const result = await super.getConfirmations();
    if (!result) return false;
    return this.confirmationService.confirmWithUser(
      this.childForm_2()!,
      this.childTransaction_2()?.transactionType?.contactConfig ?? {},
      this.confirmationContext,
      'childDialog_2',
      this.childTransaction_2(),
    );
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(
      this.childForm_2()!,
      this.childTransaction_2(),
      this.childContactTypeOptions_2(),
      this.committeeAccount(),
    );
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    if (
      this.childTransaction_2()?.transactionType?.getUseParentContact(this.childTransaction_2()) &&
      this.transaction().contact_1
    ) {
      this.childTransaction_2().contact_1 = this.transaction().contact_1;
      this.childForm_2()!.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm_2()!,
      this.childTransaction_2(),
      this.childContactIdMap_2['contact_1'],
    );

    if (this.childTransaction_2) {
      this.updateInheritedFields(this.childForm_2()!, this.childTransaction_2());
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }

  childUpdateFormWithCandidateContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      this.childForm_2()!,
      this.childTransaction_2(),
      this.childContactIdMap_2['contact_2'],
    );
  }

  childUpdateFormWithSecondaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm_2()!,
      this.childTransaction_2(),
      this.childContactIdMap_2['contact_2'],
    );
  }

  childUpdateFormWithTertiaryContact_2(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm_2()!,
      this.childTransaction_2(),
      this.childContactIdMap_2['contact_3'],
    );
  }
}
