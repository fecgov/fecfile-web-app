import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { takeUntil } from 'rxjs';
import { DestroyerComponent } from '../../app-destroyer.component';

@Component({
  selector: 'app-candidate-office-input',
  templateUrl: './candidate-office-input.component.html',
})
export class CandidateOfficeInputComponent extends DestroyerComponent implements OnInit {
  @Input() form: FormGroup = new FormGroup([]);
  @Input() formSubmitted = false;
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
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            [this.candidateStateFormControlName]: '',
            [this.candidateDistrictFormControlName]: '',
          });
          this.form.get(this.candidateStateFormControlName)?.disable();
          this.form.get(this.candidateDistrictFormControlName)?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            [this.candidateDistrictFormControlName]: '',
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
  }
}