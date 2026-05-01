import { Component, computed, effect, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { ButtonModule } from 'primeng/button';
import { InputMaskModule } from 'primeng/inputmask';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent, InputMaskModule, ButtonModule],
})
export class CalendarComponent {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');
  readonly datePicker = viewChild.required(DatePicker);
  readonly invalidFormatMessage = input('This date does not follow the correct format, e.g. 01/01/2020');
  private suppressValidation = false;

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

  validateDate() {
    if (this.suppressValidation) return;
    this.suppressValidation = true;

    const control = this.control();

    if (control) {
      const currentValue = this.datePicker().el.nativeElement.children[0].value;

      if ((!currentValue && currentValue !== 'MM/DD/YYYY') || currentValue.replaceAll(/[_/]/g, '') === '') {
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

    setTimeout(() => {
      this.suppressValidation = false;
    });
  }

  onYearChange(event: Event, delta: -1 | 1) {
    const datePicker = this.datePicker();
    if (datePicker.$disabled()) {
      event.preventDefault();
      return;
    }

    datePicker.isMonthNavigate = true;
    if (delta === 1) datePicker.incrementYear();
    else datePicker.decrementYear();

    datePicker.onMonthChange.emit({ month: datePicker.currentMonth + 1, year: datePicker.currentYear });
    datePicker.createMonths(datePicker.currentMonth, datePicker.currentYear);
  }
}
