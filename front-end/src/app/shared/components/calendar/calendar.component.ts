import { Component, input, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SignalFormControl } from 'app/shared/utils/signal-form-control';
import { DateUtils } from 'app/shared/utils/date.utils';
import { DatePicker } from 'primeng/datepicker';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, ReactiveFormsModule, ErrorMessagesComponent],
})
export class CalendarComponent implements OnInit {
  readonly form = input.required<FormGroup>();
  readonly formSubmitted = input(false);
  readonly fieldName = input.required<string>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');

  calendarOpened = false;
  control!: SignalFormControl<Date | null>;

  ngOnInit(): void {
    const form = this.form();
    const field = this.fieldName();

    this.control = form.get(field) as SignalFormControl;

    const date = DateUtils.parseDate(this.control.value);
    this.control.setValue(date);
  }

  validateDate(calendarUpdate: boolean) {
    this.calendarOpened = calendarUpdate;

    if (!this.calendarOpened && this.control) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const pendingValue = (this.control as any)._pendingValue;
      this.control.markAsTouched();
      this.control.setValue(pendingValue);
      this.control.updateValueAndValidity();
    }
  }
}
