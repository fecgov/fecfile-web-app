import { Component, computed, effect, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
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

    return control as SubscriptionFormControl;
  });

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

      if ((!currentValue && currentValue !== 'MM/DD/YYYY') || currentValue.replace(/[_/]/g, '') === '') {
        control.setValue(null);
      } else {
        const date = new Date(currentValue);
        if (date instanceof Date && !Number.isNaN(date.getTime())) {
          control.setValue(date);
        }
      }

      control.markAsTouched();
      control.updateValueAndValidity();
    }
  }
}
