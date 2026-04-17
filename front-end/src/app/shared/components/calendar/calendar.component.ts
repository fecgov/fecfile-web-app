import { Component, computed, effect, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent, ButtonModule],
})
export class CalendarComponent {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');
  readonly datePicker = viewChild.required(DatePicker);

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
      const pendingValue = (control as any)._pendingValue;
      control.markAsTouched();
      control.setValue(pendingValue);
      control.updateValueAndValidity();
    }
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
