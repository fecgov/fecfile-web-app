import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { SelectItem } from 'primeng/api';
import { NavigationEvent } from '../../models/transaction-navigation-controls.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  template: '',
})
export abstract class ReattRedesTransactionTypeBaseComponent
  extends DoubleTransactionTypeBaseComponent
  implements OnInit, OnDestroy
{
  override ngOnInit(): void {
    super.ngOnInit();

    // If the parent is a reattribution/redesignation transaction, initialize
    // its specialized validation rules and form element behavior.
    ReattRedesUtils.overlayForms(
      this.form,
      this.transaction as SchATransaction | SchBTransaction,
      this.childForm,
      this.childTransaction as SchATransaction | SchBTransaction,
    );
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
  }

  override processPayload(payload: Transaction, navigationEvent: NavigationEvent) {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(payload);
    this.transactionService.multisave(payloads).subscribe((response) => {
      navigationEvent.transaction = response[0];
      this.navigateTo(navigationEvent);
    });
  }

  updateElectionData() {
    const schedB = this.childTransaction?.reatt_redes as SchBTransaction;
    if (!schedB) return;
    this.form.get('category_code')?.setValue(schedB.category_code);
    this.form.get('beneficiary_candidate_fec_id')?.setValue(schedB.beneficiary_candidate_fec_id);
    this.form.get('beneficiary_candidate_last_name')?.setValue(schedB.beneficiary_candidate_last_name);
    this.form.get('beneficiary_candidate_first_name')?.setValue(schedB.beneficiary_candidate_first_name);
    this.form.get('beneficiary_candidate_middle_name')?.setValue(schedB.beneficiary_candidate_middle_name);
    this.form.get('beneficiary_candidate_prefix')?.setValue(schedB.beneficiary_candidate_prefix);
    this.form.get('beneficiary_candidate_suffix')?.setValue(schedB.beneficiary_candidate_suffix);
    this.form.get('beneficiary_candidate_office')?.setValue(schedB.beneficiary_candidate_office);
    this.form.get('beneficiary_candidate_state')?.setValue(schedB.beneficiary_candidate_state);
    this.form.get('beneficiary_candidate_district')?.setValue(schedB.beneficiary_candidate_district);

    this.childForm.get('election_code')?.setValue(schedB.election_code);
    this.childForm.get('election_other_description')?.setValue(schedB.election_other_description);
    this.childForm.get('category_code')?.setValue(schedB.category_code);
    this.childForm.get('beneficiary_candidate_fec_id')?.setValue(schedB.beneficiary_candidate_fec_id);
    this.childForm.get('beneficiary_candidate_last_name')?.setValue(schedB.beneficiary_candidate_last_name);
    this.childForm.get('beneficiary_candidate_first_name')?.setValue(schedB.beneficiary_candidate_first_name);
    this.childForm.get('beneficiary_candidate_middle_name')?.setValue(schedB.beneficiary_candidate_middle_name);
    this.childForm.get('beneficiary_candidate_prefix')?.setValue(schedB.beneficiary_candidate_prefix);
    this.childForm.get('beneficiary_candidate_suffix')?.setValue(schedB.beneficiary_candidate_suffix);
    this.childForm.get('beneficiary_candidate_office')?.setValue(schedB.beneficiary_candidate_office);
    this.childForm.get('beneficiary_candidate_state')?.setValue(schedB.beneficiary_candidate_state);
    this.childForm.get('beneficiary_candidate_district')?.setValue(schedB.beneficiary_candidate_district);
  }
}
