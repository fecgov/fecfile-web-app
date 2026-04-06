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

    if (!control.hasValidator(this.dateFormatValidator)) {
      control.addValidators(this.dateFormatValidator);
      // control.updateValueAndValidity({ emitEvent: false });
    }

    return control as SubscriptionFormControl;
  });

  private dateFormatValidator(control: AbstractControl): ValidationErrors | null {
    const val = control.value;

    if (val instanceof Date) return null;

    if (!val || val === 'MM/DD/YYYY') return null;

    if (typeof val === 'string' && /[MDY]/.test(val)) return { invalidFormat: true };

    const regex = /^(0[1-9]|1[0-2])\/(0[1-9]|[12][0-9]|3[01])\/\d{4}$/;
    if (!regex.test(val)) return { invalidFormat: true };

    const dateParts = val.split('/');
    const m = parseInt(dateParts[0], 10);
    const d = parseInt(dateParts[1], 10);
    const y = parseInt(dateParts[2], 10);
    const date = new Date(y, m - 1, d);

    const isValidDate = date.getFullYear() === y && date.getMonth() === m - 1 && date.getDate() === d;

    return isValidDate ? null : { invalidFormat: true };
  }

  constructor() {
    effect(() => {
      const control = this.control();
      const value = control?.value;
      if (value && typeof value === 'string' && value.length === 10 && !value.includes('D')) {
        const date = DateUtils.parseDate(value);

        if (date) {
          control.setValue(date, { emitEvent: false });
        }
      }
    });
  }

  validateDate(calendarUpdate: boolean) {
    this.calendarOpened = calendarUpdate;
    const control = this.control();

    if (!this.calendarOpened && control) {
      const inputElement = document.getElementById(this.fieldName()) as HTMLInputElement;
      const currentValue = inputElement?.value;

      if (currentValue && currentValue !== 'MM/DD/YYYY') {
        control.setValue(currentValue, { emitEvent: true });
      }

      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
