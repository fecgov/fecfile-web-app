import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { SignalControl } from 'app/shared/models/signal-form';

@Component({
  selector: 'app-signal-error-messages',
  templateUrl: './signal-error-messages.component.html',
})
export class SignalErrorMessagesComponent<T> {
  private readonly localeId = inject(LOCALE_ID);

  readonly control = input.required<SignalControl>();
  readonly formSubmitted = input.required<boolean>();

  readonly requiredErrorMessage = input('This is a required field.');
  readonly requiredTrueErrorMessage = input('This is a required field.');
  readonly patternErrorMessage = input('This field contains characters that are not allowed.');
  readonly uniqueFecIdMessage = input('FEC IDs must be unique');
  readonly isAfterMessage = input('TO date must fall chronologically after FROM date');

  readonly emailErrorMessage = input<string>();
  readonly _emailErrorMessage = computed(() => {
    const custom = this.emailErrorMessage();
    if (custom) return custom;
    const emailError = this.control().errors()['email'];
    switch (emailError?.message) {
      case 'not-unique':
        return 'Confirmation emails cannot be identical';
      case 'invalid':
        return 'This email is invalid';
      case 'taken-in-committee':
        return 'This user email already exists in this committee account.';
    }
    return 'Email Error';
  });

  readonly minLengthErrorMessage = input<string>();
  readonly _minLengthErrorMessage = computed(() => {
    const custom = this.minLengthErrorMessage();
    if (custom) return custom;
    return `This field must contain at least ${this.control().errors()['minLength']?.requiredLength} alphanumeric characters.`;
  });

  readonly maxLengthErrorMessage = input<string>();
  readonly _maxLengthErrorMessage = computed(() => {
    const custom = this.maxLengthErrorMessage();
    if (custom) return custom;
    return `This field cannot contain more than ${this.control().errors()['maxLength']?.requiredLength} alphanumeric characters.`;
  });

  readonly minErrorMessage = input<string>();
  readonly _minErrorMessage = computed(() => {
    const custom = this.minErrorMessage();
    if (custom) return custom;

    return `This field must be greater than or equal to ${formatCurrency(this.control().errors()['min']?.min, this.localeId, '$')}.`;
  });

  readonly maxErrorMessage = input<string>();
  readonly _maxErrorMessage = computed(() => {
    const custom = this.maxErrorMessage();
    if (custom) return custom;
    const error = this.control().errors()['max'];
    const prefix = error?.msgPrefix ?? 'This field must be less than or equal to';

    return `${prefix} ${formatCurrency(error?.max, this.localeId, '$')}.`;
  });

  readonly exclusiveMinErrorMessage = input<string>();
  readonly _exclusiveMinErrorMessage = computed(() => {
    const custom = this.exclusiveMinErrorMessage();
    if (custom) return custom;

    return `This field must be greater than ${formatCurrency(this.control().errors()['exclusiveMin']?.exclusiveMin, this.localeId, '$')}.`;
  });

  readonly exclusiveMaxErrorMessage = input<string>();
  readonly _exclusiveMaxErrorMessage = computed(() => {
    const custom = this.exclusiveMaxErrorMessage();
    if (custom) return custom;
    const error = this.control().errors()['exclusiveMax'];
    if (error?.exclusiveMax === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(error?.exclusiveMax, this.localeId, '$')}.`;
  });

  readonly invalidDateErrorMessage = input<string>();
  readonly _invalidDateErrorMessage = computed(() => {
    const custom = this.invalidDateErrorMessage();
    if (custom) return custom;
    return this.control().errors()['invaliddate']?.msg;
  });

  readonly noDateProvidedErrorMessage = input<string>();
  readonly _noDateProvidedErrorMessage = computed(() => {
    const custom = this.noDateProvidedErrorMessage();
    if (custom) return custom;
    return 'A disbursement or dissemination date is required to provide a linked report.';
  });

  readonly noCorrespondingForm3XErrorMessage = input<string>();
  readonly _noCorrespondingForm3XErrorMessage = computed(() => {
    const custom = this.noCorrespondingForm3XErrorMessage();
    if (custom) return custom;
    return 'There is no Form 3X with corresponding coverage dates currently in progress. Create a new Form 3X to save this transaction.';
  });

  readonly showError = computed(() => {
    return this.formSubmitted() || (!this.control().valid() && this.control().dirty());
  });

  readonly hasRequiredError = computed(() => this.control().errors()['required']);
}
