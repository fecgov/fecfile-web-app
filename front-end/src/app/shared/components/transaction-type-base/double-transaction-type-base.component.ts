import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SchATransaction } from 'app/shared/models/scha-transaction.model';
import { SchBTransaction } from 'app/shared/models/schb-transaction.model';
import { NavigationEvent } from 'app/shared/models/transaction-navigation-controls.model';
import {
  TemplateMapKeyType,
  TransactionTemplateMapType,
  TransactionType
} from 'app/shared/models/transaction-type.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { getContactTypeOptions } from 'app/shared/utils/transaction-type-properties';
import { ValidateUtils } from 'app/shared/utils/validate.utils';
import { SelectItem } from 'primeng/api';
import { concat, Observable, of, reduce } from 'rxjs';
import { singleClickEnableAction } from '../../../store/single-click.actions';
import { Contact, ContactTypeLabels } from '../../models/contact.model';
import { TransactionChildFormUtils } from './transaction-child-form.utils';
import { ContactIdMapType, TransactionContactUtils } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { TransactionTypeBaseComponent } from './transaction-type-base.component';

/**
 * This component is to help manage a form that contains 2 transactions that the
 * user needs to fill out and submit to the back end.
 *
 * The primany transaction code is inherited from the TransactionTypeBaseComponent. This
 * abstract component class adds a child transaction that is defined in the parent
 * transaction's TransactionType class.
 */
@Component({
  template: '',
})
export abstract class DoubleTransactionTypeBaseComponent
  extends TransactionTypeBaseComponent
  implements OnInit, OnDestroy {
  childFormProperties: string[] = [];
  childTransactionType?: TransactionType;
  childTransaction?: Transaction;
  childContactTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(ContactTypeLabels);
  childForm: FormGroup = this.fb.group({});
  childContactIdMap: ContactIdMapType = {};
  childTemplateMap: TransactionTemplateMapType = {} as TransactionTemplateMapType;
  childMemoCodeCheckboxLabel$ = of('');

  override ngOnInit(): void {
    // Initialize primary form.
    super.ngOnInit();

    // Initialize child form.
    if (this.transaction) {
      this.childTransaction = this.getChildTransaction(this.transaction, 0);
    } else {
      throw new Error('Fecfile: Transaction not found for double-entry transaction form');
    }
    if (!this.childTransaction) {
      throw new Error('Fecfile: Child transaction not found for double-entry transaction form');
    }
    this.childTransactionType = this.childTransaction?.transactionType;
    if (!this.childTransactionType?.templateMap) {
      throw new Error('Fecfile: Template map not found for double transaction double-entry transaction form');
    }
    this.childTemplateMap = this.childTransactionType.templateMap;
    this.childContactTypeOptions = getContactTypeOptions(this.childTransactionType.contactTypeOptions ?? []);
    this.childFormProperties = this.childTransactionType.getFormControlNames();
    this.childForm = this.fb.group(ValidateUtils.getFormGroupFields(this.childFormProperties));

    if (
      this.childTransactionType
        ?.getInheritedFields(this.childTransaction)
        ?.includes('memo_code' as TemplateMapKeyType) &&
      this.transactionType
    ) {
      this.childMemoCodeCheckboxLabel$ = this.memoCodeCheckboxLabel$;
    } else {
      this.childMemoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(this.childForm, this.childTransactionType);
    }

    TransactionFormUtils.onInit(
      this,
      this.childForm,
      this.childTransaction,
      this.childContactIdMap,
      this.contactService
    );
    TransactionChildFormUtils.childOnInit(this, this.childForm, this.childTransaction);

    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    if (ReattRedesUtils.isReattRedes(this.transaction)) {
      ReattRedesUtils.overlayForms(
        this.form,
        this.transaction as SchATransaction | SchBTransaction,
        this.childForm,
        this.childTransaction as SchATransaction | SchBTransaction
      );
      this.childUpdateFormWithPrimaryContact({
        value: this.transaction?.reatt_redes?.contact_1,
      } as SelectItem);
      if ((this.transaction as SchATransaction | SchBTransaction).reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO) {
        this.updateFormWithPrimaryContact({
          value: this.transaction?.reatt_redes?.contact_1,
        } as SelectItem);
        this.updateFormWithSecondaryContact({
          value: this.transaction?.reatt_redes?.contact_2,
        } as SelectItem);
        this.childUpdateFormWithSecondaryContact({
          value: this.transaction?.reatt_redes?.contact_2,
        } as SelectItem);
        this.updateElectionData();
      }
    }
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    Object.values(this.childContactIdMap).forEach((id$) => id$.complete());
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

  override save(navigationEvent: NavigationEvent) {
    // update all contacts with changes from form.
    if (this.transaction && this.childTransaction) {
      TransactionContactUtils.updateContactsWithForm(this.transaction, this.templateMap, this.form);
      TransactionContactUtils.updateContactsWithForm(this.childTransaction, this.childTemplateMap, this.childForm);
    } else {
      this.store.dispatch(singleClickEnableAction());
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

    if (ReattRedesUtils.isReattRedes(payload)) {
      const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload);
      this.transactionService.multisave(payloads).subscribe((response) => {
        navigationEvent.transaction = response[0];
        this.navigateTo(navigationEvent);
      });
    } else {
      this.processPayload(payload, navigationEvent);
    }
  }

  override isInvalid(): boolean {
    return super.isInvalid() || this.childForm.invalid || !this.childTransaction;
  }

  override get confirmation$(): Observable<boolean> {
    if (!this.childTransaction) return of(false);
    return concat(super.confirmation$, this.confirmWithUser(this.childTransaction, this.childForm, 'childDialog')).pipe(
      reduce((accumulator, confirmed) => accumulator && confirmed)
    );
  }

  override resetForm() {
    super.resetForm();
    TransactionFormUtils.resetForm(this.childForm, this.childTransaction,
      this.childContactTypeOptions, this.committeeAccount);
  }

  override updateFormWithPrimaryContact(selectItem: SelectItem<Contact>): void {
    super.updateFormWithPrimaryContact(selectItem);
    if (
      this.childTransaction?.transactionType?.getUseParentContact(this.childTransaction) &&
      this.transaction?.contact_1
    ) {
      this.childTransaction.contact_1 = this.transaction.contact_1;
      this.childForm.get('entity_type')?.setValue(selectItem.value.type);
    }
  }

  childUpdateFormWithPrimaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithPrimaryContact(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactIdMap['contact_1']
    );

    if (this.childTransaction) {
      this.updateInheritedFields(this.childForm, this.childTransaction);
    } else {
      throw new Error('Fecfile: Missing child transaction.');
    }
  }


  updateInheritedFields(childForm: FormGroup, childTransaction: Transaction): void {
    // Some inheritted fields (such as memo_code) cannot be set before the components are initialized.
    // This happens most reliably when the user selects a contact for the child transaction.
    // Afterwards, inheritted fields are updated to match parent values.

    childTransaction.transactionType?.getInheritedFields(childTransaction)?.forEach((inherittedField) => {
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

  childUpdateFormWithCandidateContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithCandidateContact(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactIdMap['contact_2']
    );
  }

  childUpdateFormWithSecondaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithSecondaryContact(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactIdMap['contact_2']
    );
  }

  childUpdateFormWithTertiaryContact(selectItem: SelectItem<Contact>) {
    TransactionContactUtils.updateFormWithTertiaryContact(
      selectItem,
      this.childForm,
      this.childTransaction,
      this.childContactIdMap['contact_3']
    );
  }

  updateElectionData() {
    const schedB = this.childTransaction?.reatt_redes as SchBTransaction;
    if (!schedB) return;
    this.form.get('category_code')?.setValue(schedB.category_code);
    this.form.get('beneficiary_candidate_fec_id')?.setValue(schedB.beneficiary_candidate_fec_id);
    this.form.get('beneficiary_candidate_last_name')?.setValue(schedB.beneficiary_candidate_last_name);
    this.form.get('beneficiary_candidate_first_name')?.setValue(schedB.beneficiary_candidate_first_name);
    this.form.get('beneficiary_candidate_office')?.setValue(schedB.beneficiary_candidate_office);
    this.form.get('beneficiary_candidate_state')?.setValue(schedB.beneficiary_candidate_state);
    this.form.get('beneficiary_candidate_district')?.setValue(schedB.beneficiary_candidate_district);

    this.childForm.get('election_code')?.setValue(schedB.election_code);
    this.childForm.get('election_other_description')?.setValue(schedB.election_other_description);
    this.childForm.get('category_code')?.setValue(schedB.category_code);
    this.childForm.get('beneficiary_candidate_fec_id')?.setValue(schedB.beneficiary_candidate_fec_id);
    this.childForm.get('beneficiary_candidate_last_name')?.setValue(schedB.beneficiary_candidate_last_name);
    this.childForm.get('beneficiary_candidate_first_name')?.setValue(schedB.beneficiary_candidate_first_name);
    this.childForm.get('beneficiary_candidate_office')?.setValue(schedB.beneficiary_candidate_office);
    this.childForm.get('beneficiary_candidate_state')?.setValue(schedB.beneficiary_candidate_state);
    this.childForm.get('beneficiary_candidate_district')?.setValue(schedB.beneficiary_candidate_district);
  }
}
