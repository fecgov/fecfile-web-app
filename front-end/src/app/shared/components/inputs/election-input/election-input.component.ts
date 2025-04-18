import { Component, effect, model, OnInit } from '@angular/core';
import { Validators, ReactiveFormsModule } from '@angular/forms';
import { BaseInputComponent } from '../base-input.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../../utils/reatt-redes/reatt-redes.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
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
  readonly labelPrefix = model('');

  readonly electionTypeOptions = [
    { label: 'Primary (P)', value: 'P' },
    { label: 'General (G)', value: 'G' },
    { label: 'Convention (C)', value: 'C' },
    { label: 'Runoff (R)', value: 'R' },
    { label: 'Special (S)', value: 'S' },
    { label: 'Recount (E)', value: 'E' },
    { label: 'Other (O)', value: 'O' },
  ];

  ngOnInit() {
    const transaction = this.transaction()!;
    const election_code = this.form().get('election_code')!;
    const electionType: string = election_code?.value?.slice(0, 1) || '';
    const electionYear: string = election_code?.value?.slice(1, 5) || '';

    // Create two additional form controls that will join values to populate the composit election_code form control value
    const electionTypeControl = new SignalFormControl<string>(
      this.injector,
      { value: electionType, disabled: election_code.disabled },
      Validators.required,
    );
    const electionYearControl = new SignalFormControl<string>(
      this.injector,
      { value: electionYear, disabled: election_code.disabled },
      [Validators.required, Validators.pattern('\\d{4}')],
    );
    this.form().addControl('electionType', electionTypeControl);
    this.form().addControl('electionYear', electionYearControl);
    if (election_code?.disabled && !ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REDESIGNATION_FROM])) {
      this.form().disable();
    }
    if (transaction.transactionType.electionLabelPrefix) {
      this.labelPrefix.set(transaction.transactionType.electionLabelPrefix);
    }

    if ('electionType' in transaction.transactionType.mandatoryFormValues) {
      electionTypeControl.setValue(transaction.transactionType.mandatoryFormValues['electionType']);
      electionTypeControl.disable();
    } else {
      effect(
        () => {
          electionTypeControl.valueChangeSignal();
          this.updateElectionCode();
        },
        { injector: this.injector },
      );
    }

    if ('electionYear' in transaction.transactionType.mandatoryFormValues) {
      electionYearControl.setValue(transaction.transactionType.mandatoryFormValues['electionYear']);
      electionYearControl.disable();
    } else {
      effect(
        () => {
          electionYearControl.valueChangeSignal();
          this.updateElectionCode();
        },
        { injector: this.injector },
      );
    }

    this.updateElectionCode();
  }

  private updateElectionCode() {
    const election_code = this.form().get('electionType')?.value + this.form().get('electionYear')?.value;
    this.form().get(this.templateMap()['election_code'])?.setValue(election_code);
    this.form().get(this.templateMap()['election_other_description'])?.markAsTouched();
    this.form().get(this.templateMap()['election_other_description'])?.updateValueAndValidity();
  }

  formatElectionYear(event: Event) {
    const enteredYear = (event.target as HTMLInputElement).value;
    const formattedYear = enteredYear
      .replace(/\D/g, '')
      .replace(/(\..*)\./g, '$1')
      .slice(0, 4);
    this.form().get('electionYear')?.setValue(formattedYear);
  }
}
