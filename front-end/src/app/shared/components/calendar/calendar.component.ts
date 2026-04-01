import { Component, computed, effect, input } from '@angular/core';
import { AbstractControl, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent, InputMaskModule],
})
export class CalendarComponent {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');
  readonly invalidFormatMessage = input('This date does not follow the correct format, e.g. 01/01/2020');

  calendarOpened = false;
  readonly control = computed(() => {
    const field = this.fieldName();
    const control = this.form()?.get(field);
    if (!control) return undefined;

    if (control.hasValidator(this.dateFormatValidator)) {
      control.addValidators(this.dateFormatValidator);
    }

    return control as SubscriptionFormControl;
  });

  private dateFormatValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;
    if (!val || val === 'MM/DD/YYYY') return null;

    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    const isValid = regex.test(val);
    return isValid ? null : { invalidFormat: true };
  }

  constructor() {
    effect(() => {
      const control = this.control();
      if (control) {
        const date = DateUtils.parseDate(control.value);
        control.setValue(date);
      }
    });
  }

  validateDate(calendarUpdate: boolean) {
    this.calendarOpened = calendarUpdate;
    const control = this.control();
    if (!this.calendarOpened && control) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any

      const inputElement = document.getElementById(this.fieldName()) as HTMLInputElement;
      const currentValue = inputElement.value;

      control.markAsTouched();

      if (currentValue) {
        control.setValue(currentValue, { emitEvent: true });
      }
      control.updateValueAndValidity();
    }
  }
}
