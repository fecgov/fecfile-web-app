import { Component, computed, input, OnInit } from '@angular/core';
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
  readonly officeFormControlName = input('');
  readonly stateFormControlName = input('');
  readonly districtFormControlName = input('');

  readonly officeControl = computed(() => {
    const control = this.form.get(this.officeFormControlName());
    if (!control) return undefined;
    return control as SubscriptionFormControl;
  });
  readonly stateControl = computed(() => {
    const control = this.form.get(this.stateFormControlName());
    if (!control) return undefined;
    return control as SubscriptionFormControl;
  });
  readonly districtControl = computed(() => {
    const control = this.form.get(this.districtFormControlName());
    if (!control) return undefined;
    return control as SubscriptionFormControl;
  });

  readonly candidateOfficeTypeOptions: PrimeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
  readonly candidateStateOptions: PrimeOptions = LabelUtils.getPrimeOptions(
    LabelUtils.getStateCodeLabelsWithoutMilitary(),
  );
  candidateDistrictOptions: PrimeOptions = [];

  readonly isScheduleE = computed(() => this.transactionType()?.scheduleId === ScheduleIds.E);
  readonly electionCodeField = computed(() => this.transactionType()?.templateMap.election_code);
  readonly electionControl = computed(() => {
    const electionCode = this.electionCodeField();
    if (!electionCode) return undefined;
    return this.form.get(electionCode) as SubscriptionFormControl;
  });

  ngOnInit(): void {
    // Update the enabled/disabled state on candidate fields whenever the candidate office changes.
    this.officeControl()?.addSubscription(() => this.updateCandidateFieldAvailability());

    // For Schedule E transactions, update the enabled/disabled state on the
    // candidate fields whenever the election code changes value.
    const electionControl = this.electionControl();
    if (this.isScheduleE() && electionControl) {
      electionControl.addSubscription(() => this.updateCandidateFieldAvailability());
    }

    // Update the candidate district options and value every time the candidate state field changes.
    this.stateControl()?.addSubscription(() => this.updateCandidateDistrict());

    // Run election_code, office, and state valueChange logic when initializing form elements
    if (this.isScheduleE() && electionControl) {
      electionControl.updateValueAndValidity();
    }
    this.officeControl()?.updateValueAndValidity();
    this.stateControl()?.updateValueAndValidity();
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
    const officeValue = (this.officeControl()?.value ?? '') as string;
    const electionCode = (this.electionControl()?.value ?? '') as string;

    if (!officeValue || officeValue === CandidateOfficeTypes.PRESIDENTIAL) {
      // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
      if (this.isScheduleE() && electionCode.startsWith('P')) {
        this.form.patchValue({
          [this.districtFormControlName()]: null,
        });
        this.stateControl()?.enable();
        this.districtControl()?.disable();
      } else {
        this.form.patchValue({
          [this.stateFormControlName()]: null,
          [this.districtFormControlName()]: null,
        });
        this.stateControl()?.disable();
        this.districtControl()?.disable();
      }
    } else if (officeValue === CandidateOfficeTypes.SENATE) {
      this.form.patchValue({
        [this.districtFormControlName()]: null,
      });
      this.stateControl()?.enable();
      this.districtControl()?.disable();
    } else if (!this.transaction()?.reatt_redes) {
      this.stateControl()?.enable();
      this.districtControl()?.enable();
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
    const state = this.stateControl()?.value as string | undefined;

    if (!!state && this.officeControl()?.value === CandidateOfficeTypes.HOUSE) {
      this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state));
    } else {
      this.candidateDistrictOptions = [];
    }
    const currentDistrictValue = this.districtControl()?.value;
    if (!this.candidateDistrictOptions.map((option) => option.value).includes(currentDistrictValue)) {
      this.districtControl()?.setValue(
        this.candidateDistrictOptions.length === 1 ? this.candidateDistrictOptions[0]?.value : null,
      );
    }
  }
}
