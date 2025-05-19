import { Component, Input, OnInit } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { BaseInputComponent } from '../base-input.component';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-candidate-office-input',
  styleUrls: ['./candidate-office-input.component.scss'],
  templateUrl: './candidate-office-input.component.html',
  imports: [ReactiveFormsModule, Select, ErrorMessagesComponent, InputText],
})
export class CandidateOfficeInputComponent extends BaseInputComponent implements OnInit {
  @Input() officeFormControlName = '';
  @Input() stateFormControlName = '';
  @Input() districtFormControlName = '';

  readonly candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());
  candidateDistrictOptions: PrimeOptions = [];

  electionCodeField: string | undefined = undefined;

  ngOnInit(): void {
    this.electionCodeField = this.transaction?.transactionType.templateMap.election_code;

    // Update the enabled/disabled state on candidate fields whenever the candidate office changes.
    (this.form?.get(this.officeFormControlName) as SubscriptionFormControl).addSubscription(() => {
      this.updateCandidateFieldAvailability();
    });

    // For Schedule E transactions, update the enabled/disabled state on the
    // candidate fields whenever the election code changes value.
    if (this.transaction?.transactionType.scheduleId === ScheduleIds.E && this.electionCodeField) {
      (this.form.get(this.electionCodeField) as SubscriptionFormControl)?.addSubscription(() => {
        this.updateCandidateFieldAvailability();
      });
    }

    // Update the candidate district options and value every time the candidate state field changes.
    (this.form.get(this.stateFormControlName) as SubscriptionFormControl).addSubscription(() => {
      this.updateCandidateDistrict();
    });

    // Run election_code, office, and state valueChange logic when initializing form elements
    if (
      this.transaction?.transactionType.scheduleId === ScheduleIds.E &&
      this.transaction?.transactionType.templateMap.election_code
    ) {
      this.form.get(this.transaction.transactionType.templateMap.election_code)?.updateValueAndValidity();
    }
    this.form.get(this.officeFormControlName)?.updateValueAndValidity();
    this.form.get(this.stateFormControlName)?.updateValueAndValidity();
  }

  /**
   * updateCandidateFieldStatus()
   *
   * toggles the candidate_state and candidate_office fields between enabled and disabled
   * based on a variety of factors.
   *
   * For PRESIDENTIAL candidates:
   * - District is disabled
   * - State is disabled EXCEPT for Primary elections on Schedule E transactions
   *
   * For SENATE candidates:
   * - District is disabled
   * - State is enabled
   *
   * For HOUSE candidates:
   * - District is enabled
   * - State is enabled
   */
  updateCandidateFieldAvailability() {
    const officeValue = (this.form.get(this.officeFormControlName)?.value ?? '') as string;
    let electionCode: string = '';
    if (this.electionCodeField) {
      electionCode = (this.form.get(this.electionCodeField)?.value ?? '') as string;
    }

    if (!officeValue || officeValue === CandidateOfficeTypes.PRESIDENTIAL) {
      // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
      if (this.transaction?.transactionType.scheduleId === ScheduleIds.E && electionCode.startsWith('P')) {
        this.form.patchValue({
          [this.districtFormControlName]: null,
        });
        this.form.get(this.stateFormControlName)?.enable();
        this.form.get(this.districtFormControlName)?.disable();
      } else {
        this.form.patchValue({
          [this.stateFormControlName]: null,
          [this.districtFormControlName]: null,
        });
        this.form.get(this.stateFormControlName)?.disable();
        this.form.get(this.districtFormControlName)?.disable();
      }
    } else if (officeValue === CandidateOfficeTypes.SENATE) {
      this.form.patchValue({
        [this.districtFormControlName]: null,
      });
      this.form.get(this.stateFormControlName)?.enable();
      this.form.get(this.districtFormControlName)?.disable();
    } else if (!this.transaction?.reatt_redes) {
      this.form.get(this.stateFormControlName)?.enable();
      this.form.get(this.districtFormControlName)?.enable();
    }
  }

  /**
   * updateCandidateDistrict()
   *
   * Sets the candidate district field's options to the state's available districts.
   *
   * If the currently selected district is not available in the newly selected state,
   * set the district to the topmost value in the dropdown or to null if the state has
   * no districts.
   */
  updateCandidateDistrict() {
    const state = this.form.get(this.stateFormControlName)?.value as string | undefined;

    if (!!state && this.form.get(this.officeFormControlName)?.value === CandidateOfficeTypes.HOUSE) {
      this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state));
    } else {
      this.candidateDistrictOptions = [];
    }
    const currentDistrictValue = this.form.get(this.districtFormControlName)?.value;
    if (!this.candidateDistrictOptions.map((option) => option.value).includes(currentDistrictValue)) {
      this.form
        .get(this.districtFormControlName)
        ?.setValue(this.candidateDistrictOptions.length === 1 ? this.candidateDistrictOptions[0]?.value : null);
    }
  }
}
