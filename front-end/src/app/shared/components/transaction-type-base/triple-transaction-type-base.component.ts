import { Component, computed, OnDestroy, OnInit, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { TemplateMapKeyType, TransactionTemplateMapType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SelectItem } from 'primeng/api';
import { of } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact } from '../../models/contact.model';
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
  readonly childTransaction_2 = signal<Transaction | undefined>(undefined);
  readonly childTransactionType_2 = computed(() => this.childTransaction_2()?.transactionType);
  readonly childTemplateMap_2 = computed(
    () => this.childTransactionType_2()?.templateMap ?? ({} as TransactionTemplateMapType),
  );
  readonly childFormProperties_2 = computed(() => this.childTransactionType_2()?.getFormControlNames() ?? []);
  readonly childContactTypeOptions_2 = computed(() =>
    getContactTypeOptions(this.childTransactionType_2()?.contactTypeOptions ?? []),
  );
  childForm_2: FormGroup = this.fb.group({}, { updateOn: 'blur' });
  childContactIdMap_2: ContactIdMapType = {};
  memoHasOptional_2$ = of(false);

  constructor() {
    super();
    this.forms.push(this.childForm_2);
  }

  override ngOnInit(): void {
    // Initialize primary and secondary forms.
    super.ngOnInit();

    // Initialize child form.
    const transaction = this.transaction();
    if (transaction) {
      this.childTransaction_2.set(this.getChildTransaction(transaction, 1));
    } else {
      throw new Error('FECfile+: Transaction not found for triple-entry transaction form');
    }
    const childTransaction_2 = this.childTransaction_2();
    if (!childTransaction_2) {
      throw new Error('FECfile+: Child 2 transaction not found for triple-entry transaction form');
    }
    if (!childTransaction_2.transactionType.templateMap) {
      throw new Error('FECfile+: Template map not found for triple transaction triple-entry transaction form');
    }
    this.childForm_2 = this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(this.childFormProperties_2(), childTransaction_2.transactionType.schema),
      {
        updateOn: 'blur',
      },
    );

    if (
      childTransaction_2.transactionType
        ?.getInheritedFields(childTransaction_2)
        ?.includes('memo_code' as TemplateMapKeyType) &&
      transaction.transactionType
    ) {
      this.memoHasOptional_2$ = this.memoHasOptional$;
    } else {
      this.memoHasOptional_2$ = this.getMemoHasOptional$(this.childForm_2, childTransaction_2.transactionType);
    }

    TransactionFormUtils.onInit(
      this,
      this.childForm_2,
      childTransaction_2,
      this.childContactIdMap_2,
      this.contactService,
    );
    TransactionChildFormUtils.childOnInit(this, this.childForm_2, childTransaction_2);
    this.forms = [this.form, this.childForm, this.childForm_2];
  }

  override async submit(navigationEvent: NavigationEvent): Promise<void> {
    this.updateContactData();
    const payload = TransactionFormUtils.getPayloadTransaction(
      this.transaction(),
      this.activeReportId,
      this.form,
      this.formProperties(),
    );

    payload.children = [
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction(),
        this.activeReportId,
        this.childForm,
        this.childFormProperties(),
      ),
      TransactionFormUtils.getPayloadTransaction(
        this.childTransaction_2(),
        this.activeReportId,
        this.childForm_2,
        this.childFormProperties_2(),
      ),
    ];
    payload.children[0].report_ids = payload.report_ids;
    payload.children[1].report_ids = payload.report_ids;

    return this.processPayload(payload, navigationEvent);
  }

  /**
   * update all contacts with changes from form.
   */
  protected override updateContactData() {
    const transaction = this.transaction();
    const childTransaction = this.childTransaction();
    const childTransaction_2 = this.childTransaction_2();
    if (transaction && childTransaction && childTransaction_2) {
      TransactionContactUtils.updateContactsWithForm(transaction, transaction.transactionType.templateMap, this.form);
      TransactionContactUtils.updateContactsWithForm(
        childTransaction,
        childTransaction.transactionType.templateMap,
        this.childForm,
      );
      TransactionContactUtils.updateContactsWithForm(
        childTransaction_2,
        childTransaction_2.transactionType.templateMap,
        this.childForm_2,
      );
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('FECfile+: No transactions submitted for triple-entry transaction form.');
    }
  }

  override async getConfirmations(): Promise<boolean> {
    const childTransaction_2 = this.childTransaction_2();
    if (!childTransaction_2) return false;
    const result = await super.getConfirmations();
    if (!result) return false;
    return this.confirmationService.confirmWithUser(
      this.childForm_2,
      childTransaction_2.transactionType.contactConfig ?? {},
      this.getContact.bind(this),
      this.getTemplateMap.bind(this),
      childTransaction_2,
    );
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(
      this.childForm_2,
      this.childTransaction_2(),
      this.childContactTypeOptions_2(),
      this.committeeAccount(),
    );
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    const transaction = this.transaction();
    const childTransaction_2 = this.childTransaction_2();
    if (childTransaction_2?.transactionType?.getUseParentContact(childTransaction_2) && transaction?.contact_1) {
      childTransaction_2.contact_1 = transaction.contact_1;
      this.childTransaction_2.set(
        Object.assign(Object.create(Object.getPrototypeOf(childTransaction_2)), childTransaction_2),
      );
      this.childForm_2.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact_2(selectItem: SelectItem<Contact>) {
    const childTransaction_2 = TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm_2,
      this.childTransaction_2(),
      this.childContactIdMap_2['contact_1'],
    );
    this.childTransaction_2.set(childTransaction_2);
    if (childTransaction_2) {
      this.updateInheritedFields(this.childForm_2, childTransaction_2);
    } else {
      throw new Error('FECfile+: Missing child transaction.');
    }
  }

  childUpdateFormWithCandidateContact_2(selectItem: SelectItem<Contact>) {
    this.childTransaction_2.set(
      TransactionContactUtils.updateFormWithCandidateContact(
        selectItem,
        this.childForm_2,
        this.childTransaction_2(),
        this.childContactIdMap_2['contact_2'],
      ),
    );
  }

  childUpdateFormWithSecondaryContact_2(selectItem: SelectItem<Contact>) {
    this.childTransaction_2.set(
      TransactionContactUtils.updateFormWithSecondaryContact(
        selectItem,
        this.childForm_2,
        this.childTransaction_2(),
        this.childContactIdMap_2['contact_2'],
      ),
    );
  }

  childUpdateFormWithTertiaryContact_2(selectItem: SelectItem<Contact>) {
    this.childTransaction_2.set(
      TransactionContactUtils.updateFormWithTertiaryContact(
        selectItem,
        this.childForm_2,
        this.childTransaction_2(),
        this.childContactIdMap_2['contact_3'],
      ),
    );
  }
}
