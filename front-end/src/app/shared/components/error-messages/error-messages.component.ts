import { Component, Input, OnInit, LOCALE_ID, Inject } from '@angular/core';
import { formatCurrency } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
})
export class ErrorMessagesComponent implements OnInit {
  // Pass the form and fieldName OR pass the formControl itself.
  @Input() form?: FormGroup;
  @Input() fieldName = '';
  @Input() control?: FormControl;

  // We need the submitted status of the parent form to control the hide/show
  // of the error message
  @Input() formSubmitted = false;

  @Input() requiredErrorMessage = 'This is a required field.';
  @Input() requiredTrueErrorMessage = 'This is a required field.';
  @Input() patternErrorMessage = 'This field contains characters that are not allowed.';
  @Input() uniqueFecIdMessage = 'FEC IDs must be unique';

  private _emailErrorMessage = '';
  @Input() set emailErrorMessage(value: string) {
    this._emailErrorMessage = value;
  }
  get emailErrorMessage(): string {
    if (this._emailErrorMessage) {
      return this._emailErrorMessage;
    }

    switch (this.control?.errors?.['email']) {
      case 'identical':
        return 'Confirmation emails cannot be identical';
      case 'invalid':
        return 'This email is invalid';
    }
    return 'Email Error';
  }

  private _minLengthErrorMessage = '';
  @Input() set minLengthErrorMessage(value: string) {
    this._minLengthErrorMessage = value;
  }
  get minLengthErrorMessage(): string {
    if (this._minLengthErrorMessage) {
      return this._minLengthErrorMessage;
    }
    return `This field must contain at least ${this.control?.errors?.['minlength']?.requiredLength} alphanumeric characters.`;
  }

  private _maxLengthErrorMessage = '';
  @Input() set maxLengthErrorMessage(value: string) {
    this._maxLengthErrorMessage = value;
  }
  get maxLengthErrorMessage(): string {
    if (this._maxLengthErrorMessage) {
      return this._maxLengthErrorMessage;
    }
    return `This field cannot contain more than ${this.control?.errors?.['maxlength']?.requiredLength} alphanumeric characters.`;
  }

  private _minErrorMessage = '';
  @Input() set minErrorMessage(value: string) {
    this._minErrorMessage = value;
  }
  get minErrorMessage(): string {
    if (this._minErrorMessage) {
      return this._minErrorMessage;
    }
    return `This field must be greater than or equal to ${formatCurrency(
      this.control?.errors?.['min']?.min,
      this.localeId,
      '$'
    )}.`;
  }

  private _exclusiveMinErrorMessage = '';
  @Input() set exclusiveMinErrorMessage(value: string) {
    this._exclusiveMinErrorMessage = value;
  }
  get exclusiveMinErrorMessage(): string {
    if (this._exclusiveMinErrorMessage) {
      return this._exclusiveMinErrorMessage;
    }
    return `This field must be greater than ${formatCurrency(
      this.control?.errors?.['exclusiveMin']?.exclusiveMin,
      this.localeId,
      '$'
    )}.`;
  }

  private _maxErrorMessage = '';
  @Input() set maxErrorMessage(value: string) {
    this._maxErrorMessage = value;
  }
  get maxErrorMessage(): string {
    if (this._maxErrorMessage) {
      return this._maxErrorMessage;
    }
    const msgPrefix = this.control?.errors?.['max']?.msgPrefix ?? 'This field must be less than or equal to';
    return `${msgPrefix} ${formatCurrency(this.control?.errors?.['max']?.max, this.localeId, '$')}.`;
  }

  private _exclusiveMaxErrorMessage = '';
  @Input() set exclusiveMaxErrorMessage(value: string) {
    this._exclusiveMaxErrorMessage = value;
  }
  get exclusiveMaxErrorMessage(): string {
    if (this._exclusiveMaxErrorMessage) {
      return this._exclusiveMaxErrorMessage;
    }

    if (this.control?.errors?.['exclusiveMax']?.exclusiveMax === 0) {
      return 'Amount must be negative (example: -$20.00)';
    }

    return `This field must be less than ${formatCurrency(
      this.control?.errors?.['exclusiveMax']?.exclusiveMax,
      this.localeId,
      '$'
    )}.`;
  }

  private _invalidDateErrorMessage = '';
  @Input() set invalidDateErrorMessage(value: string) {
    this._invalidDateErrorMessage = value;
  }
  get invalidDateErrorMessage(): string {
    if (this._invalidDateErrorMessage) {
      return this._invalidDateErrorMessage;
    }
    return this.control?.errors?.['invaliddate']?.msg;
  }

  constructor(@Inject(LOCALE_ID) private localeId: string) {}

  ngOnInit(): void {
    if (!this.control) {
      this.control = this.form?.get(this.fieldName) as FormControl;
    }
  }
}
