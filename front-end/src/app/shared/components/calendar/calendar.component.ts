import { Component, inject, input, viewChild } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { InputMaskModule } from 'primeng/inputmask';
import { ErrorMessagesComponent } from '../error-messages/error-messages.component';
import { DateSanitizerDirective } from './date-sanitize.directive';

type StringDate = Date | string | null;

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
  imports: [DatePicker, FormsModule, ErrorMessagesComponent, InputMaskModule, ButtonModule, DateSanitizerDirective],
})
export class CalendarComponent implements ControlValueAccessor {
  readonly ngControl = inject(NgControl, { self: true, optional: true });

  readonly formSubmitted = input.required<boolean>();
  readonly label = input.required<string>();
  readonly showErrors = input(true);
  readonly requiredErrorMessage = input('This is a required field.');
  readonly invalidFormatMessage = input('This date does not follow the correct format, e.g. 01/01/2020');
  readonly datePicker = viewChild.required(DatePicker);

  protected value: StringDate = null;
  protected disabled = false;

  protected onChange: (value: StringDate) => void = () => {};
  protected onTouched: () => void = () => {};

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  writeValue(value: StringDate): void {
    if (value instanceof Date) {
      this.value = value;
    } else if (typeof value === 'string' && value.trim() !== '') {
      const parsedDate = new Date(value);
      this.value = Number.isNaN(parsedDate.getTime()) ? value : parsedDate;
    } else {
      this.value = null;
    }
  }

  registerOnChange = (fn: () => void) => (this.onChange = fn);
  registerOnTouched = (fn: () => void) => (this.onTouched = fn);

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onDateSelect(date: StringDate): void {
    this.value = date;
    this.onChange(date);
    this.onTouched();
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
