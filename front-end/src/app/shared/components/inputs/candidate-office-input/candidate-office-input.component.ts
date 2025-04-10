import { Component, computed, input, OnInit, signal } from '@angular/core';
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
  readonly officeFormControlName = input.required<string>();
  readonly stateFormControlName = input.required<string>();
  readonly districtFormControlName = input.required<string>();

  readonly candidateOfficeTypeOptions = signal(LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels));
  readonly candidateStateOptions = signal(LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary()));
  readonly candidateDistrictOptions = signal<PrimeOptions>([]);

  electionCodeField = this.transaction()?.transactionType.templateMap.election_code;

  readonly officeFormControl = computed(() => this.form().get(this.officeFormControlName()) as SubscriptionFormControl);
  readonly stateFormControl = computed(() => this.form().get(this.stateFormControlName()) as SubscriptionFormControl);
  readonly districtFormControl = computed(
    () => this.form().get(this.districtFormControlName()) as SubscriptionFormControl,
  );

  ngOnInit(): void {
    // Update the enabled/disabled state on candidate fields whenever the candidate office changes.
    this.officeFormControl().addSubscription(() => this.updateCandidateFieldAvailability());

    // For Schedule E transactions, update the enabled/disabled state on the
    // candidate fields whenever the election code changes value.
    if (this.transaction()?.transactionType.scheduleId === ScheduleIds.E && this.electionCodeField) {
      (this.form().get(this.electionCodeField) as SubscriptionFormControl)?.addSubscription(() => {
        this.updateCandidateFieldAvailability();
      });
    }

    // Update the candidate district options and value every time the candidate state field changes.
    this.stateFormControl().addSubscription(() => {
      this.updateCandidateDistrict();
    });

    // Run election_code, office, and state valueChange logic when initializing form elements
    const election = this.transaction()?.transactionType.templateMap.election_code;
    if (this.transaction()?.transactionType.scheduleId === ScheduleIds.E && election) {
      this.form().get(election)?.updateValueAndValidity();
    }
    this.officeFormControl().updateValueAndValidity();
    this.stateFormControl().updateValueAndValidity();
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
    const officeValue = (this.officeFormControl().value ?? '') as string;
    let electionCode: string = '';
    if (this.electionCodeField) {
      electionCode = (this.form().get(this.electionCodeField)?.value ?? '') as string;
    }

    if (!officeValue || officeValue === CandidateOfficeTypes.PRESIDENTIAL) {
      // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
      if (this.transaction()?.transactionType.scheduleId === ScheduleIds.E && electionCode.startsWith('P')) {
        this.form().patchValue({
          [this.districtFormControlName()]: null,
        });
        this.stateFormControl().enable();
        this.districtFormControl().disable();
      } else {
        this.form().patchValue({
          [this.stateFormControlName()]: null,
          [this.districtFormControlName()]: null,
        });
        this.stateFormControl().disable();
        this.districtFormControl().disable();
      }
    } else if (officeValue === CandidateOfficeTypes.SENATE) {
      this.form().patchValue({
        [this.districtFormControlName()]: null,
      });
      this.stateFormControl().enable();
      this.districtFormControl().disable();
    } else if (!this.transaction()?.reatt_redes) {
      this.stateFormControl().enable();
      this.districtFormControl().enable();
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
    const state = this.stateFormControl().value as string | undefined;

    if (!!state && this.officeFormControl().value === CandidateOfficeTypes.HOUSE) {
      this.candidateDistrictOptions.set(LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state)));
    } else {
      this.candidateDistrictOptions.set([]);
    }
    const currentDistrictValue = this.districtFormControl().value;
    if (
      !this.candidateDistrictOptions()
        .map((option) => option.value)
        .includes(currentDistrictValue)
    ) {
      this.form()
        .get(this.districtFormControlName())
        ?.setValue(this.candidateDistrictOptions().length === 1 ? this.candidateDistrictOptions()[0]?.value : null);
    }
  }
}
