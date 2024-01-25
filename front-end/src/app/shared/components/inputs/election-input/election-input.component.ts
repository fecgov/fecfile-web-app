import { Component, OnInit, Input } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit {
  @Input() labelPrefix = '';

  electionTypeOptions = [
    { label: 'Primary (P)', value: 'P' },
    { label: 'General (G)', value: 'G' },
    { label: 'Convention (C)', value: 'C' },
    { label: 'Runoff (R)', value: 'R' },
    { label: 'Special (S)', value: 'S' },
    { label: 'Recount (E)', value: 'E' },
    { label: 'Other (O)', value: 'O' },
  ];

  ngOnInit(): void {
    if (this.transaction?.transactionType.electionLabelPrefix) {
      this.labelPrefix = this.transaction?.transactionType.electionLabelPrefix;
    }

    // Get inital values for election type and year for additional form inputs
    const election_code = this.form.get('election_code');
    const electionType = election_code?.value?.slice(0, 1) || '';
    const electionYear = election_code?.value?.slice(1, 5) || '';

    // Create two additional form controls that will join values to populate the composit election_code form control value
    this.form.addControl('electionType', new FormControl(electionType, Validators.required));
    this.form.addControl(
      'electionYear',
      new FormControl(electionYear, [Validators.required, Validators.pattern('\\d{4}')])
    );

    // If the election_code is disabled, extend that through to the proxy electionType and electionYear form elements.
    if (election_code?.disabled) {
      this.form.get('electionType')?.disable();
      this.form.get('electionYear')?.disable();
    }

    // Check for maditoryField designation and disable if necessary
    if (this.transaction && 'electionType' in this.transaction.transactionType.mandatoryFormValues) {
      this.form.get('electionType')?.setValue(this.transaction.transactionType.mandatoryFormValues['electionType']);
      this.form.get('electionType')?.disable();
    } else {
      this.form
        .get('electionType')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateElectionCode();
        });
    }
    if (this.transaction && 'electionYear' in this.transaction.transactionType.mandatoryFormValues) {
      this.form.get('electionYear')?.setValue(this.transaction.transactionType.mandatoryFormValues['electionYear']);
      this.form.get('electionYear')?.disable();
    } else {
      this.form
        .get('electionYear')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateElectionCode();
        });
    }
    this.updateElectionCode();
  }

  updateElectionCode() {
    const election_code = this.form.get('electionType')?.value + this.form.get('electionYear')?.value;
    this.form.get(this.templateMap['election_code'])?.setValue(election_code);
    this.form.get(this.templateMap['election_other_description'])?.markAsTouched();
    this.form.get(this.templateMap['election_other_description'])?.updateValueAndValidity();
  }
}
