import { Component, OnDestroy, OnInit } from '@angular/core';
import { DoubleTransactionTypeBaseComponent } from './double-transaction-type-base.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../utils/reatt-redes/reatt-redes.utils';
import { SchATransaction } from '../../models/scha-transaction.model';
import { SchBTransaction } from '../../models/schb-transaction.model';
import { SelectItem } from 'primeng/api';
import { NavigationEvent } from '../../models/transaction-navigation-controls.model';
import { Transaction } from '../../models/transaction.model';
import { lastValueFrom, Observable } from 'rxjs';
import { getContactTypeOptions } from '../../utils/transaction-type-properties';
import { ValidateUtils } from '../../utils/validate.utils';
import { TransactionTemplateMapType, TransactionType } from '../../models/transaction-type.model';
import { PrimeOptions } from '../../utils/label.utils';
import { FormGroup } from '@angular/forms';
import { ContactIdMapType } from './transaction-contact.utils';
import { TransactionFormUtils } from './transaction-form.utils';

interface Originating {
  transaction: Transaction;
  transactionType: TransactionType;
  templateMap: TransactionTemplateMapType;
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
  FormGroup = this.fb.group({});
  pullForward = false;
  originating: Originating = {} as Originating;

  override async ngOnInit(): Promise<void> {
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
    await this.initializePullForward();
  }

  override processPayload(payload: SchATransaction | SchBTransaction, navigationEvent: NavigationEvent) {
    const payloads: (SchATransaction | SchBTransaction)[] = ReattRedesUtils.getPayloads(
      payload,
      this.originating.transaction,
    );
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
    const reattributionId = this.activatedRoute.snapshot.queryParams['reattribution'];
    this.originating.transaction = await lastValueFrom(this.transactionService.get(reattributionId));
    this.pullForward = this.originating.transaction.report_id !== reportId;
    if (!this.pullForward) return;

    this.originating.transactionType = this.originating.transaction.transactionType;
    this.originating.templateMap = this.originating.transactionType.templateMap;
    this.originating.formProperties = this.originating.transactionType.getFormControlNames();
    this.originating.contactTypeOptions = getContactTypeOptions(
      this.originating.transactionType.contactTypeOptions ?? [],
    );

    this.originating.form = this.fb.group(ValidateUtils.getFormGroupFields(this.originating.formProperties));
    this.originating.contactIdMap = {};
    this.originating.memoCodeCheckboxLabel$ = this.getMemoCodeCheckboxLabel$(
      this.originating.form,
      this.originating.transactionType,
    );

    this.originating.form.patchValue({ ...this.originating.transaction });
    this.originating.form.get(this.originating.templateMap['memo_code'])?.setValue(true);
    TransactionFormUtils.patchMemoText(this.originating.transaction, this.originating.form);
    this.originating.form.disable();
  }
}
