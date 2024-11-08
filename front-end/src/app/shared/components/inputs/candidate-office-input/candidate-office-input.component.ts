import { Component, Input, OnInit } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ScheduleIds } from 'app/shared/models/transaction.model';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';

@Component({
  selector: 'app-candidate-office-input',
  styleUrls: ['./candidate-office-input.component.scss'],
  templateUrl: './candidate-office-input.component.html',
})
export class CandidateOfficeInputComponent extends BaseInputComponent implements OnInit {
  @Input() officeFormControlName = '';
  @Input() stateFormControlName = '';
  @Input() districtFormControlName = '';

  candidateOfficeTypeOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  electionCodeField = '';

  ngOnInit(): void {
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    if (this.transaction?.transactionType) {
      this.electionCodeField = this.transaction.transactionType.templateMap.election_code;

      // For Schedule E transactions, we need to track the election code so that we
      // can make the candidate state required for presidential primaries.
      if (
        this.transaction?.transactionType.scheduleId === ScheduleIds.E &&
        this.transaction?.transactionType.templateMap.election_code
      ) {
        (
          this.form.get(this.transaction.transactionType.templateMap.election_code) as SubscriptionFormControl
        )?.addSubscription(() => {
          this.updateForms();
        });
      }
    }

    const officeFormControl = this.form?.get(this.officeFormControlName) as SubscriptionFormControl;
    console.log(officeFormControl);
    officeFormControl.addSubscription(() => {
      this.updateForms();
    });

    this.form
      ?.get(this.stateFormControlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get(this.officeFormControlName)?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
        const currentDistrictValue = this.form.get(this.districtFormControlName)?.value;
        if (!this.candidateDistrictOptions.map((option) => option.value).includes(currentDistrictValue)) {
          this.form
            .get(this.districtFormControlName)
            ?.setValue(this.candidateDistrictOptions.length === 1 ? this.candidateDistrictOptions[0].value : null);
        }
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

  updateForms() {
    const officeValue = (this.form.get(this.officeFormControlName)?.value ?? '') as string;
    let electionCode: string = '';
    if (this.electionCodeField) {
      electionCode = (this.form.get(this.electionCodeField)?.value ?? '') as string;
    }

    if (!officeValue || officeValue === CandidateOfficeTypes.PRESIDENTIAL) {
      // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
      if (
        this.transaction?.transactionType.scheduleId === ScheduleIds.E &&
        electionCode &&
        electionCode.startsWith('P')
      ) {
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
}
