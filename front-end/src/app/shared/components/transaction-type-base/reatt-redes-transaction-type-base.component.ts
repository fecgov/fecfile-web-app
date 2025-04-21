import { Component, computed, effect, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { SelectItem } from 'primeng/api';
import { NavigationEvent } from '../../models/transaction-navigation-controls.model';
import { getContactTypeOptions } from '../../utils/transaction-type-properties';
import { SchemaUtils } from '../../utils/schema.utils';
import { TransactionFormUtils } from './transaction-form.utils';
import { PrimeOptions } from '../../utils/label.utils';
import { FormGroup, Validators } from '@angular/forms';
import { ContactIdMapType } from './transaction-contact.utils';
import { RedesignationFromUtils } from 'app/shared/utils/reatt-redes/redesignation-from.utils';
import { ContactTypes, TemplateMapKeyType } from 'app/shared/models';
import { buildReattRedesTransactionValidator } from 'app/shared/utils/validators.utils';
import { RedesignationToUtils } from 'app/shared/utils/reatt-redes/redesignation-to.utils';
import { ReattributionFromUtils } from 'app/shared/utils/reatt-redes/reattribution-from.utils';

interface AccordionData {
  formProperties: string[];
  contactTypeOptions: PrimeOptions;
  form: FormGroup;
  memoCodeCheckboxLabel: string;
  contactIdMap: ContactIdMapType;
}

@Component({
  template: '',
})
export abstract class ReattRedesTransactionTypeBaseComponent
  extends DoubleTransactionTypeBaseComponent
  implements OnInit
{
  readonly pullForward = computed(() => {
    const tx = this.transaction();
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return !!tx?.reatt_redes && !tx.reatt_redes.report_ids?.includes(reportId);
  });
  readonly reattributedData = computed<AccordionData | null>(() => {
    const tx = this.transaction();
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reatt = tx?.reatt_redes;

    if (!reatt || reatt.report_ids?.includes(reportId)) return null;
    reatt.can_delete = true;
    const txType = reatt.transactionType;
    const formProperties = txType.getFormControlNames();
    const form = this.fb.group(SchemaUtils.getFormGroupFieldsNoBlur(this.injector, formProperties, txType.schema), {
      updateOn: 'blur',
    });
    form.patchValue({ ...reatt });
    form.get(txType.templateMap['memo_code'])?.setValue(true);
    TransactionFormUtils.patchMemoText(reatt, form);
    form.disable();

    return {
      formProperties,
      contactTypeOptions: getContactTypeOptions(txType.contactTypeOptions ?? []),
      form,
      contactIdMap: {},
      memoCodeCheckboxLabel: this.getMemoCodeCheckboxLabel(form, txType),
    };
  });

  override ngOnInit() {
    super.ngOnInit();
    const tx = this.transaction() as SchATransaction | SchBTransaction;
    this.childUpdateFormWithPrimaryContact({
      value: tx.reatt_redes?.contact_1,
    } as SelectItem);
    if (tx.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO) {
      this.updateFormWithPrimaryContact({
        value: tx.reatt_redes?.contact_1,
      } as SelectItem);
      this.updateFormWithSecondaryContact({
        value: tx.reatt_redes?.contact_2,
      } as SelectItem);
      this.childUpdateFormWithSecondaryContact({
        value: tx.reatt_redes?.contact_2,
      } as SelectItem);
      this.updateElectionData();
    }
    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    this.overlayForms(tx, this.childTransaction() as SchATransaction | SchBTransaction);
  }

  private overlayForms(toTx: SchATransaction | SchBTransaction, fromTx: SchATransaction | SchBTransaction): void {
    if (toTx.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      this.reatToOverlayForm(toTx as SchATransaction);
      this.reatFromOverlayForm(fromTx as SchATransaction);
    }
    if (toTx.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO) {
      this.redesToOverlayForm(toTx as SchBTransaction);
      this.redesFromOverlayForm(fromTx as SchBTransaction);
    }
  }

  private reatToOverlayForm(toTx: SchATransaction) {
    this.getControl(toTx.transactionType.templateMap.amount)?.addValidators([
      buildReattRedesTransactionValidator(toTx),
    ]);
    this.getControl('contribution_purpose_descrip')?.clearAsyncValidators();
    const memoCode = this.getControl('memo_code');
    memoCode?.clearAsyncValidators();
    memoCode?.setValue(true);
    memoCode?.disable();
  }

  private reatFromOverlayForm(transaction: SchATransaction) {
    const purpose = this.getChildControl(transaction.transactionType.templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purpose?.clearAsyncValidators();
    this.getChildControl('memo_code')?.clearAsyncValidators();

    // Watch for changes to the "TO" transaction entity name and then update the "FROM" transaction expenditure purpose description.
    effect(
      () => {
        const org = this.getControl(transaction.transactionType.templateMap.organization_name)?.valueChangeSignal();
        const first = this.getControl(transaction.transactionType.templateMap.first_name)?.valueChangeSignal();
        const last = this.getControl(transaction.transactionType.templateMap.last_name)?.valueChangeSignal();
        const isIndividual = this.getControl('entity_type')?.value === ContactTypes.INDIVIDUAL;
        const name = isIndividual ? `Reattribution to ${first} ${last}` : `Reattribution to ${org}`;
        purpose?.setValue(name);
      },
      { injector: this.injector },
    );

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    effect(
      () => {
        const amount = this.getControl(transaction.transactionType.templateMap.amount)?.valueChangeSignal();
        if (amount)
          this.getChildControl(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
      },
      { injector: this.injector },
    );

    ReattributionFromUtils.readOnlyFields.forEach((field) =>
      this.getChildControl(transaction.transactionType.templateMap[field])?.disable(),
    );
  }

  private redesToOverlayForm(toTx: SchBTransaction) {
    // Add additional amount validation
    this.getControl(toTx.transactionType.templateMap.amount)?.addValidators([
      buildReattRedesTransactionValidator(toTx),
    ]);

    // Clear normal schema validation from redesignation TO form
    this.getControl(toTx.transactionType.templateMap.purpose_description)?.clearAsyncValidators();
    const memoCode = this.getControl('memo_code');
    memoCode?.clearAsyncValidators();
    memoCode?.setValue(true);

    RedesignationToUtils.readOnlyFields.forEach((field) =>
      this.getControl(toTx.transactionType.templateMap[field as TemplateMapKeyType])?.disable(),
    );
  }

  private redesFromOverlayForm(transaction: SchBTransaction) {
    const template = transaction.transactionType.templateMap;
    const purpose = this.getChildControl(template.purpose_description);
    const memoCode = this.getChildControl('memo_code');
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purpose?.clearAsyncValidators();
    memoCode?.clearAsyncValidators();
    memoCode?.addValidators(Validators.requiredTrue);
    memoCode?.setValue(true);

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    effect(() => {
      const amount = this.getControl(template.amount)?.valueChangeSignal();
      if (amount) this.getChildControl(template.amount)?.setValue(-1 * parseFloat(amount));
    });
    effect(() => {
      const date = this.getControl(template.date)?.valueChangeSignal();
      this.getChildControl(template.date)?.setValue(date);
    });

    RedesignationFromUtils.readOnlyFields.forEach((field) =>
      this.getChildControl(template[field as TemplateMapKeyType])?.disable(),
    );
  }

  override async processPayload(
    payload: SchATransaction | SchBTransaction,
    navigationEvent: NavigationEvent,
  ): Promise<void> {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload, this.pullForward());
    const response = await this.transactionService.multiSaveReattRedes(payloads);
    navigationEvent.transaction = response[0];
    this.navigateTo(navigationEvent);
  }

  updateElectionData() {
    const schedB = this.childTransaction()?.reatt_redes as SchBTransaction;
    if (!schedB) return;
    const forms = [this.form(), this.childForm()];
    forms.forEach((form) => {
      form.get('category_code')?.setValue(schedB.category_code);
      form.get('beneficiary_candidate_fec_id')?.setValue(schedB.beneficiary_candidate_fec_id);
      form.get('beneficiary_candidate_last_name')?.setValue(schedB.beneficiary_candidate_last_name);
      form.get('beneficiary_candidate_first_name')?.setValue(schedB.beneficiary_candidate_first_name);
      form.get('beneficiary_candidate_middle_name')?.setValue(schedB.beneficiary_candidate_middle_name);
      form.get('beneficiary_candidate_prefix')?.setValue(schedB.beneficiary_candidate_prefix);
      form.get('beneficiary_candidate_suffix')?.setValue(schedB.beneficiary_candidate_suffix);
      form.get('beneficiary_candidate_office')?.setValue(schedB.beneficiary_candidate_office);
      form.get('beneficiary_candidate_state')?.setValue(schedB.beneficiary_candidate_state);
      form.get('beneficiary_candidate_district')?.setValue(schedB.beneficiary_candidate_district);
    });

    this.childForm().get('election_code')?.setValue(schedB.election_code);
    this.childForm().get('election_other_description')?.setValue(schedB.election_other_description);
  }
}
