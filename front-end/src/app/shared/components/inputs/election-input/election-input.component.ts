import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit {
  electionTypeOptions = [
    { label: 'Primary (P)', value: 'P' },
    { label: 'General (G)', value: 'G' },
    { label: 'Convention (C)', value: 'C' },
    { label: 'Runoff (R)', value: 'R' },
    { label: 'Special (S)', value: 'S' },
    { label: 'Recount (E)', value: 'E' },
  ];

  ngOnInit(): void {
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

    if (election_code?.disabled) {
      this.form.disable();
    }

    // Listen to election type and year form inputs and update election_code upon value changes
    this.form
      .get('electionType')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateElectionCode();
      });
    this.form
      .get('electionYear')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateElectionCode();
      });
  }

  updateElectionCode() {
    const election_code = this.form.get('electionType')?.value + this.form.get('electionYear')?.value;
    this.form.get(this.templateMap['election_code'])?.setValue(election_code);
    this.form.get(this.templateMap['election_other_description'])?.markAsTouched();
    this.form.get(this.templateMap['election_other_description'])?.updateValueAndValidity();
  }
}
