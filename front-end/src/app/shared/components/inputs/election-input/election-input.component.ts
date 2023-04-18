import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { combineLatest, Subject } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  electionTypeOptions = [
    { label: 'Primary', value: 'P' },
    { label: 'General', value: 'G' },
    { label: 'Convention', value: 'C' },
    { label: 'Runoff', value: 'R' },
    { label: 'Special', value: 'S' },
    { label: 'Recount', value: 'E' },
  ];

  ngOnInit(): void {
    // Create two additional form controls that will join values to populate the composit election_code form control value
    const electionTypeControl = new FormControl('', Validators.required);
    const electionYearControl = new FormControl('', [Validators.required, Validators.pattern('\\d{4}')]);
    this.form.addControl('electionType', electionTypeControl);
    this.form.addControl('electionYear', electionYearControl);

    // Get inital values for election type and year for additional form inputs
    const election_code = this.form.get('election_code')?.value;
    if (election_code) {
      this.form.patchValue({
        electionType: election_code.slice(0, 1),
        electionYear: election_code.slice(1, 5),
      });
    }

    // Listen to election type and year form inputs and update election_code upon value changes

    combineLatest([electionTypeControl.valueChanges, electionYearControl.valueChanges]).subscribe(([type, year]) => {
      this.updateElectionCode(type || '', year || '');
    });
  }

  updateElectionCode(type: string, year: string) {
    const election_code = type + year;
    this.form.patchValue({ [this.templateMap['election_code']]: election_code });
    this.form.get(this.templateMap['election_other_description'])?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
