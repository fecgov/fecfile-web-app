import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit {
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
    this.form.get('electionType')?.valueChanges.subscribe(() => {
      this.updateElectionCode();
    });
    this.form.get('electionYear')?.valueChanges.subscribe(() => {
      this.updateElectionCode();
    });
  }

  updateElectionCode() {
    // Update the election_other_description as well so as to fire off its validation rule check
    const election_code = this.form.get('electionType')?.value + this.form.get('electionYear')?.value;
    const election_other_description = this.form.get(this.templateMap['election_other_description'])?.value;
    this.form.patchValue({
      [this.templateMap['election_code']]: election_code,
      [this.templateMap['election_other_description']]: election_other_description,
    });
  }
}
