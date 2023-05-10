import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit, OnDestroy {
  electionTypeOptions = [
    { label: 'Primary (P)', value: 'P' },
    { label: 'General (G)', value: 'G' },
    { label: 'Convention (C)', value: 'C' },
    { label: 'Runoff (R)', value: 'R' },
    { label: 'Special (S)', value: 'S' },
    { label: 'Recount (E)', value: 'E' },
  ];
  private destroy$ = new Subject<boolean>();

  ngOnInit(): void {
    // Create two additional form controls that will join values to populate the composit election_code form control value
    this.form.addControl('electionType', new FormControl('', Validators.required));
    this.form.addControl('electionYear', new FormControl('', [Validators.required, Validators.pattern('\\d{4}')]));

    // Get inital values for election type and year for additional form inputs
    const election_code = this.form.get('election_code')?.value;
    if (election_code) {
      this.form.patchValue({
        electionType: election_code.slice(0, 1),
        electionYear: election_code.slice(1, 5),
      });
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
