import { Component, computed, OnInit, signal, viewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import { TemplateMapKeyType } from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { SchemaUtils } from 'app/shared/utils/schema.utils';
import { SelectItem } from 'primeng/api';
import { Contact } from '../../models/contact.model';
import { TransactionChildFormUtils } from './transaction-child-form.utils';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { blurActiveInput } from 'app/shared/utils/form.utils';
import { Accordion } from 'primeng/accordion';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

/**
 * This component is to help manage a form that contains 2 transactions that the
 * user needs to fill out and submit to the back end.
 *
 * The primary transaction code is inherited from the TransactionTypeBaseComponent. This
 * abstract component class adds a child transaction that is defined in the parent
 * transaction's TransactionType class.
 */
@Component({
  template: '',
})
export abstract class DoubleTransactionTypeBaseComponent extends TransactionTypeBaseComponent implements OnInit {
  readonly accordion = viewChild.required(Accordion);
  readonly childFormProperties = computed(() => this.childTransactionType()?.getFormControlNames() ?? []);
  readonly childTransactionType = computed(() => this.childTransaction()?.transactionType);
  readonly childTransaction = computed(() => {
    const transaction = this.transaction();
    if (!transaction) return undefined;
    return this.getChildTransaction(transaction, 0);
  });
  readonly childContactTypeOptions = computed(() =>
    getContactTypeOptions(this.childTransactionType()?.contactTypeOptions ?? []),
  );
  readonly childForm = signal<FormGroup>(this.fb.group({}, { updateOn: 'blur' }));
  childContactIdMap: ContactIdMapType = {};
  readonly childTemplateMap = computed(() => this.childTransactionType()?.templateMap);
  readonly childMemoCodeCheckboxLabel = computed(() => {
    const childTransaction = this.childTransaction();
    const childTransactionType = this.childTransactionType();
    if (!childTransaction) return '';
    if (
      childTransactionType?.getInheritedFields(childTransaction)?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType()
    ) {
      return this.memoCodeCheckboxLabel();
    } else {
      return this.getMemoCodeCheckboxLabel(this.childForm(), childTransactionType);
    }
  });

  override ngOnInit() {
    super.ngOnInit();
    const childTransactionType = this.childTransactionType();
    const childTransaction = this.childTransaction();

    if (!childTransaction || !childTransactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for double transaction double-entry transaction form');
    }
    this.childForm.set(
      this.fb.group(
        SchemaUtils.getFormGroupFieldsNoBlur(this.injector, this.childFormProperties(), childTransactionType.schema),
        {
          updateOn: 'blur',
        },
      ),
    );

    TransactionFormUtils.onInit(
      this,
      this.childForm(),
      this.childTransaction(),
      this.childContactIdMap,
      this.contactService,
      this.injector,
    );
    TransactionChildFormUtils.childOnInit(this, this.childForm(), childTransaction, this.injector);
    // Determine which accordion pane to open initially based on transaction id in page URL
    const transactionId = this.activatedRoute.snapshot.params['transactionId'];
    if (childTransaction && transactionId && childTransaction?.id === transactionId && this.accordion) {
      this.accordion().value.set(1);
    }
  }

  /**
   * For certain transactions, like CONDUIT_EARMARK_OUT, the transaction_type_identifier
   * will not match the transaction type model name because it is assigned DEPOSITED
   * and UNDEPOSITED variations of the model name for its TTI. We account for that here
   * when comparing the child to the transaction types dependent on the parent
   * @param transaction
   * @param index
   * @returns
   */
  getChildTransaction(transaction: Transaction, index: number): Transaction | undefined {
    return transaction?.children?.filter((child) => {
      const transactionTypeId = transaction?.transactionType?.dependentChildTransactionTypes?.[index];
      const transactionTypeIdVariations = [
        transactionTypeId,
        `${transactionTypeId}_DEPOSITED`,
        `${transactionTypeId}_UNDEPOSITED`,
      ];
      return transactionTypeIdVariations.includes(child.transaction_type_identifier);
    })[0];
  }

  override save(navigationEvent: NavigationEvent): Promise<void> {
    // update all contacts with changes from form.
    const transaction = this.transaction();
    const childTransaction = this.childTransaction();
    const childTemplateMap = this.childTemplateMap();
    if (transaction && childTransaction && childTemplateMap) {
      TransactionContactUtils.updateContactsWithForm(transaction, this.templateMap()!, this.form());
      TransactionContactUtils.updateContactsWithForm(childTransaction, childTemplateMap, this.childForm());
    } else {
      this.store.dispatch(singleClickEnableAction());
      throw new Error('Fecfile: No transactions submitted for double-entry transaction form.');
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
    ];
    payload.children[0].reports = payload.reports;

    return this.processPayload(payload, navigationEvent);
  }

  override isInvalid(): boolean {
    blurActiveInput(this.childForm());
    return super.isInvalid() || this.childForm().invalid || !this.childTransaction;
  }

  override async getConfirmations(): Promise<boolean> {
    if (!this.childTransaction) return false;
    const result = await super.getConfirmations();
    if (!result) return false;
    return this.confirmationService.confirmWithUser(
      this.childForm(),
      this.childTransactionType()?.contactConfig ?? {},
      this.confirmationContext,
      'childDialog',
      this.childTransaction(),
    );
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(
      this.childForm(),
      this.childTransaction(),
      this.childContactTypeOptions(),
      this.committeeAccount(),
    );
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    const childTransaction = this.childTransaction();
    if (!childTransaction) return;
    if (this.childTransactionType()?.getUseParentContact(childTransaction) && this.transaction()?.contact_1) {
      childTransaction.contact_1 = this.transaction()?.contact_1;
      this.childForm().get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    const childTransaction = this.childTransaction();
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm(),
      childTransaction,
      this.childContactIdMap['contact_1'],
    );

    if (childTransaction) {
      this.updateInheritedFields(this.childForm(), childTransaction);
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }

  updateInheritedFields(childForm: FormGroup, childTransaction: Transaction): void {
    // Some inherited fields (such as memo_code) cannot be set before the components are initialized.
    // This happens most reliably when the user selects a contact for the child transaction.
    // Afterwards, inherited fields are updated to match parent values.

    childTransaction.transactionType?.getInheritedFields(childTransaction)?.forEach((inherittedField) => {
      if (childTransaction.transactionType) {
        const childFieldControl = childForm.get(childTransaction.transactionType.templateMap[inherittedField]);
        childFieldControl?.enable();
        const value = this.form().get(this.templateMap()![inherittedField])?.value;
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

  childUpdateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      this.childForm(),
      this.childTransaction(),
      this.childContactIdMap['contact_2'],
    );
  }

  childUpdateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm(),
      this.childTransaction(),
      this.childContactIdMap['contact_2'],
    );
  }

  childUpdateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithTertiaryContact(
      selectItem,
      this.childForm(),
      this.childTransaction(),
      this.childContactIdMap['contact_3'],
    );
  }

  protected getChildControl(field: string) {
    const control = this.childForm().get(field);
    if (!control) return undefined;
    return control as SignalFormControl;
  }
}
