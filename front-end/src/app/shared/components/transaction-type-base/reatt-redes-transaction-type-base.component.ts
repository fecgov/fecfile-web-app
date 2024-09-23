import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ContactIdMapType } from './transaction-contact.utils';

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
export abstract class ReattRedesTransactionTypeBaseComponent
  extends DoubleTransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  FormGroup = this.fb.group({}, { updateOn: 'blur' });
  pullForward = false;
  reattributedData = {} as AccordionData;

  override async ngOnInit(): Promise<void> {
    super.ngOnInit();
    this.childUpdateFormWithPrimaryContact({
      value: this.transaction?.reatt_redes?.contact_1,
    } as SelectItem);
    if (
      (this.transaction as SchATransaction | SchBTransaction).reattribution_redesignation_tag ===
      ReattRedesTypes.REDESIGNATION_TO
    ) {
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
    this.initializePullForward();
    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    ReattRedesUtils.overlayForms(
      this.form,
      this.transaction as SchATransaction | SchBTransaction,
      this.childForm,
      this.childTransaction as SchATransaction | SchBTransaction,
    );
  }

  override processPayload(payload: SchATransaction | SchBTransaction, navigationEvent: NavigationEvent) {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload, this.pullForward);
    this.transactionService.multiSaveReattRedes(payloads).subscribe((response) => {
      navigationEvent.transaction = response[0];
      this.navigateTo(navigationEvent);
    });
  }

  updateElectionData() {
    const schedB = this.childTransaction?.reatt_redes as SchBTransaction;
    if (!schedB) return;
    const forms = [this.form, this.childForm];
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

    this.childForm.get('election_code')?.setValue(schedB.election_code);
    this.childForm.get('election_other_description')?.setValue(schedB.election_other_description);
  }

  private async initializePullForward() {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    const reatRedes = this.transaction?.reatt_redes;
    if (!reatRedes) return;
    this.pullForward = reatRedes.report_ids?.includes(reportId) === false;
    if (!this.pullForward) return;

    this.reattributedData.formProperties = reatRedes.transactionType.getFormControlNames();
    this.reattributedData.contactTypeOptions = getContactTypeOptions(
      reatRedes.transactionType.contactTypeOptions ?? [],
    );

    this.reattributedData.form = this.fb.group(SchemaUtils.getFormGroupFields(this.reattributedData.formProperties), {
      updateOn: 'blur',
    });
    this.reattributedData.contactIdMap = {};
    this.reattributedData.memoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(
      this.reattributedData.form,
      reatRedes.transactionType,
    );

    this.reattributedData.form.patchValue({ ...reatRedes });
    this.reattributedData.form.get(reatRedes.transactionType.templateMap['memo_code'])?.setValue(true);
    TransactionFormUtils.patchMemoText(reatRedes, this.reattributedData.form);
    this.reattributedData.form.disable();
  }
}
