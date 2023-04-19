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
  electionTypeControl = new FormControl('', Validators.required);
  electionYearControl = new FormControl('', [Validators.required, Validators.pattern('\\d{4}')]);

  ngOnInit(): void {
    this.form.addControl('electionType', this.electionTypeControl);
    this.form.addControl('electionYear', this.electionYearControl);
    // Get inital values for election type and year for additional form inputs
    const election_code = this.form.get('election_code')?.value;
    if (election_code) {
      this.electionTypeControl.setValue(election_code.slice(0, 1));
      this.electionYearControl.setValue(election_code.slice(1, 5));
    }

    // Listen to election type and year form inputs and update election_code upon value changes

    combineLatest([this.electionTypeControl.valueChanges, this.electionYearControl.valueChanges]).subscribe(
      ([type, year]) => {
        this.updateElectionCode(type || '', year || '');
      }
    );
  }

  updateElectionCode(type: string, year: string) {
    const election_code = type + year;
    this.form.get(this.templateMap['election_code'])?.patchValue(election_code);
    this.form.get(this.templateMap['election_other_description'])?.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
