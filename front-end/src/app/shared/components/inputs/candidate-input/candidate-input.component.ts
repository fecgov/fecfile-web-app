import { Component, OnInit } from '@angular/core';
import { CandidateOfficeTypeLabels, CandidateOfficeTypes } from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-candidate-input',
  templateUrl: './candidate-input.component.html',
})
export class CandidateInputComponent extends BaseInputComponent implements OnInit {
  candidateOfficeTypeOptions: PrimeOptions = [];
  candidateStateOptions: PrimeOptions = [];
  candidateDistrictOptions: PrimeOptions = [];

  ngOnInit(): void {
    // TODO: look to combine this with contact-form component ngOnInit
    this.candidateOfficeTypeOptions = LabelUtils.getPrimeOptions(CandidateOfficeTypeLabels);
    this.candidateStateOptions = LabelUtils.getPrimeOptions(LabelUtils.getStateCodeLabelsWithoutMilitary());

    this.form
      ?.get('candidate_office')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!value || value === CandidateOfficeTypes.PRESIDENTIAL) {
          this.form.patchValue({
            candidate_state: '',
            candidate_district: '',
          });
          this.form.get('candidate_state')?.disable();
          this.form.get('candidate_district')?.disable();
        } else if (value === CandidateOfficeTypes.SENATE) {
          this.form.patchValue({
            candidate_district: '',
          });
          this.form.get('candidate_state')?.enable();
          this.form.get('candidate_district')?.disable();
        } else {
          this.form.get('candidate_state')?.enable();
          this.form.get('candidate_district')?.enable();
        }
      });

    this.form
      ?.get('candidate_state')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (!!value && this.form.get('candidate_office')?.value === CandidateOfficeTypes.HOUSE) {
          this.candidateDistrictOptions = LabelUtils.getPrimeOptions(LabelUtils.getCongressionalDistrictLabels(value));
        } else {
          this.candidateDistrictOptions = [];
        }
      });
  }
}
