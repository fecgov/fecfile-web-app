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
  @Input() minLengthErrorMessage = '';
  @Input() maxLengthErrorMessage = '';
  @Input() patternErrorMessage = 'This field contains characters that are not allowed.';

  control: FormGroup | null = null;

  ngOnInit(): void {
    this.control = this.form?.get(this.fieldName) as FormGroup;
  }
}
