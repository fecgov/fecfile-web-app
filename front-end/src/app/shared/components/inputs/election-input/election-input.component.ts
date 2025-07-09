import { Component, computed, OnInit } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../../utils/reatt-redes/reatt-redes.utils';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { Select } from 'primeng/select';
import { PrimeTemplate } from 'primeng/api';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputText } from 'primeng/inputtext';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
  imports: [ReactiveFormsModule, Select, PrimeTemplate, ErrorMessagesComponent, InputText],
})
export class ElectionInputComponent extends BaseInputComponent implements OnInit {
  readonly labelPrefix = computed(() => this.transactionType()?.electionLabelPrefix ?? '');

  readonly electionTypeOptions = [
    { label: 'Primary (P)', value: 'P' },
    { label: 'General (G)', value: 'G' },
    { label: 'Convention (C)', value: 'C' },
    { label: 'Runoff (R)', value: 'R' },
    { label: 'Special (S)', value: 'S' },
    { label: 'Recount (E)', value: 'E' },
    { label: 'Other (O)', value: 'O' },
  ];

  ngOnInit(): void {
    // Get inital values for election type and year for additional form inputs

    const election_code = this.form.get('election_code');
    const electionType = election_code?.value?.slice(0, 1) ?? '';
    const electionYear = election_code?.value?.slice(1, 5) ?? '';

    // Create two additional form controls that will join values to populate the composit election_code form control value
    this.form.addControl('electionType', new SubscriptionFormControl(electionType, Validators.required));
    this.form.addControl(
      'electionYear',
      new SubscriptionFormControl(electionYear, [Validators.required, Validators.pattern('\\d{4}')]),
    );

    if (election_code?.disabled) {
      this.form.get('electionType')?.disable();
      this.form.get('electionYear')?.disable();
      if (!ReattRedesUtils.isReattRedes(this.transaction(), [ReattRedesTypes.REDESIGNATION_FROM])) {
        this.form.disable();
      }
    }

    // Check for mandatory Field designation and disable if necessary
    const transaction = this.transaction();
    if (transaction && 'electionType' in transaction.transactionType.mandatoryFormValues) {
      this.form.get('electionType')?.setValue(transaction.transactionType.mandatoryFormValues['electionType']);
      this.form.get('electionType')?.disable();
    } else {
      this.form
        .get('electionType')
        ?.valueChanges.pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.updateElectionCode();
        });
    }
    if (transaction && 'electionYear' in transaction.transactionType.mandatoryFormValues) {
      this.form.get('electionYear')?.setValue(transaction.transactionType.mandatoryFormValues['electionYear']);
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

  formatElectionYear(event: Event) {
    const enteredYear = (event.target as HTMLInputElement).value;
    const formattedYear = enteredYear
      .replace(/[^0-9]/g, '')
      .replace(/(\..*)\./g, '$1')
      .slice(0, 4);
    this.form.get('electionYear')?.setValue(formattedYear);
  }
}
