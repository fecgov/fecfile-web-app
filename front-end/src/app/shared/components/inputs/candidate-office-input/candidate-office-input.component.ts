import { Component, computed, effect, input, signal } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { BaseInputComponent } from '../base-input.component';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { ReactiveFormsModule } from '@angular/forms';
import { Select } from 'primeng/select';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputText } from 'primeng/inputtext';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-candidate-office-input',
  styleUrls: ['./candidate-office-input.component.scss'],
  templateUrl: './candidate-office-input.component.html',
  imports: [ReactiveFormsModule, Select, ErrorMessagesComponent, InputText],
})
export class CandidateOfficeInputComponent extends BaseInputComponent {
  readonly officeFormControlName = input.required<string>();
  readonly stateFormControlName = input.required<string>();
  readonly districtFormControlName = input.required<string>();

  readonly candidateOfficeTypeOptions = signal(LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels));
  readonly candidateStateOptions = signal(LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary()));
  readonly candidateDistrictOptions = signal<PrimeOptions>([]);

  readonly electionCodeField = this.transaction()?.transactionType.templateMap.election_code;

  readonly officeFormControl = computed(() => this.getControl(this.officeFormControlName()));
  readonly stateFormControl = computed(() => this.getControl(this.stateFormControlName()));
  readonly districtFormControl = computed(() => this.getControl(this.districtFormControlName()));

  constructor() {
    super();
    // Update the enabled/disabled state on candidate fields whenever the candidate office changes.
    effect(() => {
      this.officeFormControl()?.valueChangeSignal();
      this.updateCandidateFieldAvailability();
    });

    // For Schedule E transactions, update the enabled/disabled state on the
    // candidate fields whenever the election code changes value.
    effectOnceIf(
      () => this.transaction()?.transactionType.scheduleId === ScheduleIds.E && this.electionCodeField,
      () => {
        effect(
          () => {
            this.getControl(this.electionCodeField!)?.valueChangeSignal();
            this.updateCandidateFieldAvailability();
          },
          { injector: this.injector },
        );
      },
    );

    // Update the candidate district options and value every time the candidate state field changes.
    effect(() => {
      this.stateFormControl()?.valueChangeSignal();
      this.updateCandidateDistrict();
    });

    // Run election_code, office, and state valueChange logic when initializing form elements
    effectOnceIf(
      () =>
        this.transaction()?.transactionType.templateMap.election_code &&
        this.transaction()?.transactionType.scheduleId === ScheduleIds.E,
      () => {
        this.form().get(this.transaction()!.transactionType.templateMap.election_code)?.updateValueAndValidity();
      },
    );
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
    const officeValue = (this.officeFormControl()?.value ?? '') as string;
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
        this.stateFormControl()?.enable();
        this.districtFormControl()?.disable();
      } else {
        this.form().patchValue({
          [this.stateFormControlName()]: null,
          [this.districtFormControlName()]: null,
        });
        this.stateFormControl()?.disable();
        this.districtFormControl()?.disable();
      }
    } else if (officeValue === CandidateOfficeTypes.SENATE) {
      this.form().patchValue({
        [this.districtFormControlName()]: null,
      });
      this.stateFormControl()?.enable();
      this.districtFormControl()?.disable();
    } else if (!this.transaction()?.reatt_redes) {
      this.stateFormControl()?.enable();
      this.districtFormControl()?.enable();
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
    const state = this.stateFormControl()?.value as string | undefined;

    if (!!state && this.officeFormControl()?.value === CandidateOfficeTypes.HOUSE) {
      this.candidateDistrictOptions.set(LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(state)));
    } else {
      this.candidateDistrictOptions.set([]);
    }
    const currentDistrictValue = this.districtFormControl()?.value;
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
