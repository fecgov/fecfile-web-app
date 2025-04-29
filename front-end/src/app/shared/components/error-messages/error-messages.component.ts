import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { NgxControlError } from 'ngxtension/control-error';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
  imports: [NgxControlError],
})
export class ErrorMessagesComponent {
  private readonly localeId = inject(LOCALE_ID);
  // Pass the form and fieldName OR pass the formControl itself.
  readonly control = input<SignalFormControl>();

  // We need the submitted status of the parent form to control the hide/show
  // of the error message
  readonly formSubmitted = input(false);

  readonly requiredErrorMessage = input('This is a required field.');
  readonly requiredTrueErrorMessage = input('This is a required field.');
  readonly patternErrorMessage = input('This field contains characters that are not allowed.');
  readonly uniqueFecIdMessage = input('FEC IDs must be unique');
  readonly isAfterMessage = input('TO date must fall chronologically after FROM date');

  readonly emailErrorMessage = input<string>();
  readonly _emailErrorMessage = computed(() => {
    this.control()?.valueChangeSignal();
    const customMessage = this.emailErrorMessage();
    if (customMessage) return customMessage;

    const emailErrors = this.control()?.errors?.['email'];
    switch (emailErrors) {
      case 'not-unique':
        return 'Confirmation emails cannot be identical';
      case 'invalid':
        return 'This email is invalid';
      case 'taken-in-committee':
        return 'This user email already exists in this committee account.';
      default:
        return 'Email Error';
    }
  });

  readonly minLengthErrorMessage = input<string>();
  readonly _minLengthErrorMessage = computed(
    () =>
      this.minLengthErrorMessage() ??
      `This field must contain at least ${this.control()?.errors?.['minlength']?.requiredLength} alphanumeric characters.`,
  );

  readonly maxLengthErrorMessage = input<string>();
  readonly _maxLengthErrorMessage = computed(
    () =>
      this.maxLengthErrorMessage() ??
      `This field cannot contain more than ${this.control()?.errors?.['maxlength']?.requiredLength} alphanumeric characters.`,
  );

  readonly minErrorMessage = input<string>();
  readonly _minErrorMessage = computed(
    () =>
      this.minErrorMessage() ??
      `This field must be greater than or equal to ${formatCurrency(
        this.control()?.errors?.['min']?.min,
        this.localeId,
        '$',
      )}.`,
  );

  readonly exclusiveMinErrorMessage = input<string>();
  readonly _exclusiveMinErrorMessage = computed(() => {
    if (this.exclusiveMinErrorMessage()) {
      return this.exclusiveMinErrorMessage();
    }

    const exclusiveMin = this.control()?.errors?.['exclusiveMin']?.exclusiveMin;
    if (exclusiveMin === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(exclusiveMin, this.localeId, '$')}.`;
  });

  readonly maxErrorMessage = input<string>();
  readonly _maxErrorMessage = computed(() => {
    if (this.maxErrorMessage()) return this.maxErrorMessage();

    const error = this.control()?.errors?.['max'];
    const msgPrefix = error?.msgPrefix ?? 'This field must be less than or equal to';
    return `${msgPrefix} ${formatCurrency(error?.max, this.localeId, '$')}.`;
  });

  readonly exclusiveMaxErrorMessage = input<string>();
  readonly _exclusiveMaxErrorMessage = computed(() => {
    if (this.exclusiveMaxErrorMessage()) return this.exclusiveMaxErrorMessage();

    const exclusiveMax = this.control()?.errors?.['exclusiveMax']?.exclusiveMax;
    if (exclusiveMax === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(exclusiveMax, this.localeId, '$')}.`;
  });

  readonly invalidDateErrorMessage = input<string>();
  readonly _invalidDateErrorMessage = computed(
    () => this.invalidDateErrorMessage() ?? this.control()?.errors?.['invaliddate']?.msg,
  );

  readonly noDateProvidedErrorMessage = input<string>();
  readonly _noDateProvidedErrorMessage = computed(
    () =>
      this.noDateProvidedErrorMessage() ??
      'A disbursement or dissemination date is required to provide a linked report.',
  );

  readonly noCorrespondingForm3XErrorMessage = input<string>();
  readonly _noCorrespondingForm3XErrorMessage = computed(
    () =>
      this.noCorrespondingForm3XErrorMessage() ??
      'There is no Form 3X with corresponding coverage dates currently in progress. Create a new Form 3X to save this transaction.',
  );
}
