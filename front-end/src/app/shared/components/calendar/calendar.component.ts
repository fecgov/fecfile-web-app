import { Component, computed, input, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SubscriptionFormControl } from 'app/shared/utils/subscription-form-control';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { DateSanitizerDirective } from './date-sanitize.directive';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [
    DatePicker,
    ReactiveFormsModule,
    ErrorMessagesComponent,
    InputMaskModule,
    ButtonModule,
    DateSanitizerDirective,
  ],
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
  readonly control = computed(() => this.form().get(this.fieldName()) as SubscriptionFormControl);

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
