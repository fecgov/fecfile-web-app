import { Component, computed, inject, input, LOCALE_ID } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { AbstractControl, FormControl } from '@angular/forms';
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

  readonly emailErrorMessageInput = input<string>('', { alias: 'emailErrorMessage' });
  readonly emailErrorMessage = computed(() => {
    this.control()?.valueChangeSignal();
    const customMessage = this.emailErrorMessageInput();
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

  readonly minLengthErrorMessageInput = input<string>('', { alias: 'minLengthErrorMessage' });
  readonly minLengthErrorMessage = computed(
    () =>
      this.minLengthErrorMessageInput() ||
      `This field must contain at least ${this.control()?.errors?.['minlength']?.requiredLength} alphanumeric characters.`,
  );

  readonly maxLengthErrorMessageInput = input<string>('', { alias: 'maxLengthErrorMessage' });
  readonly maxLengthErrorMessage = computed(
    () =>
      this.maxLengthErrorMessageInput() ||
      `This field cannot contain more than ${this.control()?.errors?.['maxlength']?.requiredLength} alphanumeric characters.`,
  );

  readonly minErrorMessageInput = input<string>('', { alias: 'minErrorMessage' });
  readonly minErrorMessage = computed(
    () =>
      this.minErrorMessageInput() ||
      `This field must be greater than or equal to ${formatCurrency(
        this.control()?.errors?.['min']?.min,
        this.localeId,
        '$',
      )}.`,
  );

  readonly exclusiveMinErrorMessageInput = input<string>('', { alias: 'exclusiveMinErrorMessage' });
  readonly exclusiveMinErrorMessage = computed(() => {
    if (this.exclusiveMinErrorMessageInput()) {
      return this.exclusiveMinErrorMessageInput();
    }

    const exclusiveMin = this.control()?.errors?.['exclusiveMin']?.exclusiveMin;
    if (exclusiveMin === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(exclusiveMin, this.localeId, '$')}.`;
  });

  readonly maxErrorMessageInput = input<string>('', { alias: 'maxErrorMessage' });
  readonly maxErrorMessage = computed(() => {
    if (this.maxErrorMessageInput()) return this.maxErrorMessageInput();

    const error = this.control()?.errors?.['max'];
    const msgPrefix = error?.msgPrefix ?? 'This field must be less than or equal to';
    return `${msgPrefix} ${formatCurrency(error?.max, this.localeId, '$')}.`;
  });

  readonly exclusiveMaxErrorMessageInput = input<string>('', { alias: 'exclusiveMaxErrorMessage' });
  readonly exclusiveMaxErrorMessage = computed(() => {
    if (this.exclusiveMaxErrorMessageInput()) return this.exclusiveMaxErrorMessageInput();

    const exclusiveMax = this.control()?.errors?.['exclusiveMax']?.exclusiveMax;
    if (exclusiveMax === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(exclusiveMax, this.localeId, '$')}.`;
  });

  readonly invalidDateErrorMessageInput = input<string>('', { alias: 'invalidDateErrorMessage' });
  readonly invalidDateErrorMessage = computed(
    () => this.invalidDateErrorMessageInput() || this.control()?.errors?.['invaliddate']?.msg,
  );

  readonly noDateProvidedErrorMessageInput = input<string>('', { alias: 'noDateProvidedErrorMessage' });
  readonly noDateProvidedErrorMessage = computed(
    () =>
      this.noDateProvidedErrorMessageInput() ||
      'A disbursement or dissemination date is required to provide a linked report.',
  );

  readonly noCorrespondingForm3XErrorMessageInput = input<string>('', { alias: 'noCorrespondingForm3XErrorMessage' });
  readonly noCorrespondingForm3XErrorMessage = computed(
    () =>
      this.noCorrespondingForm3XErrorMessageInput() ||
      'There is no Form 3X with corresponding coverage dates currently in progress. Create a new Form 3X to save this transaction.',
  );
}
