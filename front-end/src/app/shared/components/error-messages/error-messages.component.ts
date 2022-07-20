import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-error-messages',
  templateUrl: './error-messages.component.html',
})
export class ErrorMessagesComponent implements OnInit {
  @Input() form: FormGroup | null = null;
  @Input() fieldName = '';
  @Input() formSubmitted = false;
  @Input() requiredErrorMessage = 'This is a required field.';
  @Input() patternErrorMessage = 'This field contains characters that are not allowed.';
  @Input() invalidEmailErrorMessage = 'This email is invalid';
  @Input() identicalEmailErrorMessage = 'Confirmation emails cannot be identical';

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

  control: FormGroup | null = null;

  ngOnInit(): void {
    this.control = this.form?.get(this.fieldName) as FormGroup;
  }
}
