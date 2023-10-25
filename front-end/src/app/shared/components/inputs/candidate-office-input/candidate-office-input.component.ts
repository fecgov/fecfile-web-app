import { Component, Input, OnInit } from '@angular/core';
import {
  CandidateOfficeTypeLabels,
  CandidateOfficeTypes,
  STANDARD_AND_CANDIDATE,
  STANDARD_AND_CANDIDATE_PRESIDENTIAL_PRIMARY,
} from 'app/shared/models/contact.model';
import { LabelUtils, PrimeOptions } from 'app/shared/utils/label.utils';
import { takeUntil, of, combineLatest } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ScheduleIds } from 'app/shared/models/transaction.model';

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

    // For Schedule E transactions, we need to track the election code so that we
    // can make the candidate state required for presidential primaries.
    let electionCodeValue$ = of('');
    if (
      this.transaction?.transactionType.scheduleId === ScheduleIds.E &&
      this.transaction?.transactionType.templateMap.election_code
    ) {
      electionCodeValue$ =
        this.form
          ?.get(this.transaction.transactionType.templateMap.election_code)
          ?.valueChanges.pipe(takeUntil(this.destroy$)) ?? of('');
    }

    const officeValue$ =
      this.form?.get(this.officeFormControlName)?.valueChanges.pipe(takeUntil(this.destroy$)) ?? of('');

    combineLatest([electionCodeValue$, officeValue$]).subscribe(([electionCode, officeValue]) => {
      if (this.transaction) {
        this.transaction.transactionType.contactConfig = STANDARD_AND_CANDIDATE;
      }
      if (!officeValue || officeValue === CandidateOfficeTypes.PRESIDENTIAL) {
        // Handle special case for Schedule E where presidential primaries require the candidate state to have a value.
        if (this.transaction?.transactionType.scheduleId === ScheduleIds.E && electionCode.startsWith('P')) {
          this.form.patchValue({
            [this.districtFormControlName]: null,
          });
          this.form.get(this.stateFormControlName)?.enable();
          this.form.get(this.districtFormControlName)?.disable();
          // Do not save the candidate_state to the candidate contact record.
          this.transaction.transactionType.contactConfig = STANDARD_AND_CANDIDATE_PRESIDENTIAL_PRIMARY;
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
}
