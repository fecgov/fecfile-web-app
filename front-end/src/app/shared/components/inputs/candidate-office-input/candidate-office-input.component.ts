import { Component, Input, OnInit } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-candidate-office-input',
  templateUrl: './candidate-office-input.component.html',
})
export class CandidateOfficeInputComponent extends BaseInputComponent implements OnInit {
  @Input() officeFormControlName = '';
  @Input() stateFormControlName = '';
  @Input() districtFormControlName = '';

  candidateOfficeTypeOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  ngOnInit(): void {
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get(this.officeFormControlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            [this.stateFormControlName]: null,
            [this.districtFormControlName]: null,
          });
          this.form.get(this.stateFormControlName)?.disable();
          this.form.get(this.districtFormControlName)?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            [this.districtFormControlName]: null,
          });
          this.form.get(this.stateFormControlName)?.enable();
          this.form.get(this.districtFormControlName)?.disable();
        } else {
          this.form.get(this.stateFormControlName)?.enable();
          this.form.get(this.districtFormControlName)?.enable();
        }
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
      });

    // Run office and state valueChange logic when initializing form elements
    this.form.get(this.officeFormControlName)?.updateValueAndValidity();
    this.form.get(this.stateFormControlName)?.updateValueAndValidity();
  }
}
