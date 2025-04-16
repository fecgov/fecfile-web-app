import { Component, effect } from '@angular/core';
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
import { combineLatest, Observable, of } from 'rxjs';
import { ContactIdMapType } from './transaction-contact.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { RedesignationFromUtils } from 'app/shared/utils/reatt-redes/redesignation-from.utils';
import { ContactTypes, TemplateMapKeyType } from 'app/shared/models';
import { buildReattRedesTransactionValidator } from 'app/shared/utils/validators.utils';
import { RedesignationToUtils } from 'app/shared/utils/reatt-redes/redesignation-to.utils';
import { ReattributionFromUtils } from 'app/shared/utils/reatt-redes/reattribution-from.utils';

interface AccordionData {
  formProperties: string[];
  contactTypeOptions: PrimeOptions;
  form: FormGroup;
  memoCodeCheckboxLabel$: Observable<string>;
  contactIdMap: ContactIdMapType;
}

@Component({
  template: '',
})
export abstract class ReattRedesTransactionTypeBaseComponent extends DoubleTransactionTypeBaseComponent {
  pullForward = false;
  reattributedData = {} as AccordionData;

  constructor() {
    super();
    this.childUpdateFormWithPrimaryContact({
      value: this.transaction()?.reatt_redes?.contact_1,
    } as SelectItem);
    if (
      (this.transaction() as SchATransaction | SchBTransaction).reattribution_redesignation_tag ===
      ReattRedesTypes.REDESIGNATION_TO
    ) {
      this.updateFormWithPrimaryContact({
        value: this.transaction()?.reatt_redes?.contact_1,
      } as SelectItem);
      this.updateFormWithSecondaryContact({
        value: this.transaction()?.reatt_redes?.contact_2,
      } as SelectItem);
      this.childUpdateFormWithSecondaryContact({
        value: this.transaction()?.reatt_redes?.contact_2,
      } as SelectItem);
      this.updateElectionData();
    }
    this.initializePullForward();
    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    this.overlayForms(
      this.form(),
      this.transaction() as SchATransaction | SchBTransaction,
      this.childForm(),
      this.childTransaction as SchATransaction | SchBTransaction,
    );
  }

  overlayForms(
    toForm: FormGroup,
    toTransaction: SchATransaction | SchBTransaction,
    fromForm: FormGroup,
    fromTransaction: SchATransaction | SchBTransaction,
  ): void {
    if (toTransaction.reattribution_redesignation_tag === ReattRedesTypes.REATTRIBUTION_TO) {
      this.reatToOverlayForm(toForm, toTransaction as SchATransaction);
      this.reatFromOverlayForm(fromForm, fromTransaction as SchATransaction, toForm);
    }
    if (toTransaction.reattribution_redesignation_tag === ReattRedesTypes.REDESIGNATION_TO) {
      this.redesToOverlayForm(toForm, toTransaction as SchBTransaction);
      this.redesFromOverlayForm(fromForm, fromTransaction as SchBTransaction, toForm);
    }
  }

  reatToOverlayForm(form: FormGroup, transaction: SchATransaction): FormGroup {
    // Add additional amount validation
    form
      .get(transaction.transactionType.templateMap.amount)
      ?.addValidators([buildReattRedesTransactionValidator(transaction)]);

    // Clear normal schema validation from reattribution TO form
    form.get('contribution_purpose_descrip')?.clearAsyncValidators();
    form.get('memo_code')?.clearAsyncValidators();
    form.get('memo_code')?.setValue(true);
    form.get('memo_code')?.disable();

    return form;
  }

  reatFromOverlayForm(fromForm: FormGroup, transaction: SchATransaction, toForm: FormGroup): FormGroup {
    const purposeDescriptionControl = fromForm.get(transaction.transactionType.templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescriptionControl?.clearAsyncValidators();
    fromForm.get('memo_code')?.clearAsyncValidators();

    // Watch for changes to the "TO" transaction entity name and then update the "FROM" transaction expenditure purpose description.
    combineLatest([
      toForm.get(transaction.transactionType.templateMap.organization_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.first_name)?.valueChanges ?? of(null),
      toForm.get(transaction.transactionType.templateMap.last_name)?.valueChanges ?? of(null),
    ]).subscribe(([orgName, firstName, lastName]) => {
      if (toForm.get('entity_type')?.value === ContactTypes.INDIVIDUAL) {
        purposeDescriptionControl?.setValue(`Reattribution to ${firstName} ${lastName}`);
      } else {
        purposeDescriptionControl?.setValue(`Reattribution to ${orgName}`);
      }
    });

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    toForm.get(transaction.transactionType.templateMap.amount)?.valueChanges.subscribe((amount) => {
      fromForm.get(transaction.transactionType.templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });

    ReattributionFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(transaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable(),
    );

    return fromForm;
  }

  redesToOverlayForm(form: FormGroup, toTransaction: SchBTransaction): FormGroup {
    // Add additional amount validation
    form
      .get(toTransaction.transactionType.templateMap.amount)
      ?.addValidators([buildReattRedesTransactionValidator(toTransaction)]);

    // Clear normal schema validation from redesignation TO form
    form.get(toTransaction.transactionType.templateMap.purpose_description)?.clearAsyncValidators();
    form.get('memo_code')?.clearAsyncValidators();
    form.get('memo_code')?.setValue(true);

    RedesignationToUtils.readOnlyFields.forEach((field) =>
      form.get(toTransaction.transactionType.templateMap[field as TemplateMapKeyType])?.disable(),
    );
    return form;
  }

  redesFromOverlayForm(fromForm: FormGroup, transaction: SchBTransaction, toForm: FormGroup): FormGroup {
    const templateMap = transaction.transactionType.templateMap;
    const purposeDescriptionControl = fromForm.get(templateMap.purpose_description);
    // Update purpose description for rules that are independent of the transaction date being in the report.
    purposeDescriptionControl?.clearAsyncValidators();
    fromForm.get('memo_code')?.clearAsyncValidators();
    fromForm.get('memo_code')?.addValidators(Validators.requiredTrue);
    fromForm.get('memo_code')?.setValue(true);

    // Watch for changes to the "TO" transaction amount and copy the negative of it to the "FROM" transaction amount.
    effect(() => {
      const amount = (toForm.get(templateMap.amount) as SignalFormControl)?.valueChangeSignal();
      fromForm.get(templateMap.amount)?.setValue(-1 * parseFloat(amount));
    });
    effect(() => {
      const date = (toForm.get(templateMap.date) as SignalFormControl)?.valueChangeSignal();
      fromForm.get(templateMap.date)?.setValue(date);
    });

    RedesignationFromUtils.readOnlyFields.forEach((field) =>
      fromForm.get(templateMap[field as TemplateMapKeyType])?.disable(),
    );

    return fromForm;
  }

  override async processPayload(
    payload: SchATransaction | SchBTransaction,
    navigationEvent: NavigationEvent,
  ): Promise<void> {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload, this.pullForward);
    const response = await this.transactionService.multiSaveReattRedes(payloads);
    navigationEvent.transaction = response[0];
    this.navigateTo(navigationEvent);
  }

  updateElectionData() {
    const schedB = this.childTransaction?.reatt_redes as SchBTransaction;
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

  private initializePullForward() {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reatRedes = this.transaction()?.reatt_redes;
    if (!reatRedes) return;
    this.pullForward = reatRedes.report_ids?.includes(reportId) === false;
    if (!this.pullForward) return;

    this.reattributedData.formProperties = reatRedes.transactionType.getFormControlNames();
    this.reattributedData.contactTypeOptions = getContactTypeOptions(
      reatRedes.transactionType.contactTypeOptions ?? [],
    );

    this.reattributedData.form = this.fb.group(
      SchemaUtils.getFormGroupFieldsNoBlur(
        this.injector,
        this.reattributedData.formProperties,
        reatRedes.transactionType.schema,
      ),
      {
        updateOn: 'blur',
      },
    );
    this.reattributedData.contactIdMap = {};
    this.reattributedData.memoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(
      this.reattributedData.form,
      reatRedes.transactionType,
    );
    reatRedes.can_delete = true;
    this.reattributedData.form.patchValue({ ...reatRedes });
    this.reattributedData.form.get(reatRedes.transactionType.templateMap['memo_code'])?.setValue(true);
    TransactionFormUtils.patchMemoText(reatRedes, this.reattributedData.form);
    this.reattributedData.form.disable();
  }
}
