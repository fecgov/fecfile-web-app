import { Component, effect, model } from '@angular/core';
import { Validators, ReactiveFormsModule, FormControl } from '@angular/forms';
import { takeUntil } from 'rxjs';
import { BaseInputComponent } from '../base-input.component';
import { ReattRedesTypes, ReattRedesUtils } from '../../../utils/reatt-redes/reatt-redes.utils';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { Select } from 'primeng/select';
import { PrimeTemplate } from 'primeng/api';
import { ErrorMessagesComponent } from '../../error-messages/error-messages.component';
import { InputText } from 'primeng/inputtext';
import { effectOnceIf } from 'ngxtension/effect-once-if';

@Component({
  selector: 'app-election-input',
  templateUrl: './election-input.component.html',
  imports: [ReactiveFormsModule, Select, PrimeTemplate, ErrorMessagesComponent, InputText],
})
export class ElectionInputComponent extends BaseInputComponent {
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

  constructor() {
    super();
    const election_code = this.form().get('election_code');
    const electionType = election_code?.value?.slice(0, 1) || '';
    const electionYear = election_code?.value?.slice(1, 5) || '';

    // Create two additional form controls that will join values to populate the composit election_code form control value
    const electionTypeControl = new SignalFormControl(
      this.injector,
      { value: electionType, disable: election_code?.disabled },
      Validators.required,
    );
    const electionYearControl = new SignalFormControl(
      this.injector,
      { value: electionYear, disable: election_code?.disabled },
      [Validators.required, Validators.pattern('\\d{4}')],
    );
    this.form().addControl('electionType', electionTypeControl);
    this.form().addControl('electionYear', electionYearControl);

    // Check for mandatory Field designation and disable if necessary

    this.updateElectionCode();

    effectOnceIf(
      () => this.transaction(),
      () => {
        const transaction = this.transaction()!;
        if (
          election_code?.disabled &&
          !ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REDESIGNATION_FROM])
        ) {
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
      },
    );
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
