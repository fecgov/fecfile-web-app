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
  @Input() candidateOfficeFormControlName = '';
  @Input() candidateStateFormControlName = '';
  @Input() candidateDistrictFormControlName = '';

  candidateOfficeTypeOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  ngOnInit(): void {
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get(this.candidateOfficeFormControlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        // MJT - here enable
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            [this.candidateStateFormControlName]: null,
            [this.candidateDistrictFormControlName]: null,
          });
          this.form.get(this.candidateStateFormControlName)?.disable();
          this.form.get(this.candidateDistrictFormControlName)?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            [this.candidateDistrictFormControlName]: null,
          });
          this.form.get(this.candidateStateFormControlName)?.enable();
          this.form.get(this.candidateDistrictFormControlName)?.disable();
        } else {
          this.form.get(this.candidateStateFormControlName)?.enable();
          this.form.get(this.candidateDistrictFormControlName)?.enable();
        }
      });

    this.form
      ?.get(this.candidateStateFormControlName)
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get(this.candidateOfficeFormControlName)?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });

    // Run office and state valueChange logic when initializing form elements
    this.form.get(this.candidateOfficeFormControlName)?.updateValueAndValidity();
    this.form.get(this.candidateStateFormControlName)?.updateValueAndValidity();
  }
}
