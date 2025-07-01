import { Component, computed, effect, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent],
})
export class CalendarComponent {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input.required<boolean>();
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');

  calendarOpened = false;
  readonly control = computed(() => {
    const field = this.fieldName();
    console.log(`field: ${field}`);
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
}
