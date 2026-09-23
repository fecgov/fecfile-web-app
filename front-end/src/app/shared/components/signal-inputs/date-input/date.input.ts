import { Component, viewChild } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { BaseInput } from '../base.input';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { LabelComponent } from '../label.component';

export type StringDate = Date | string | null;

@Component({
  selector: 'app-date-input',
  imports: [DatePicker, FormsModule, InputMaskModule, ButtonModule, LabelComponent],
  templateUrl: 'date.input.html',
  styleUrls: ['../input.scss', './date.input.scss'],
})
export class DateInput extends BaseInput<StringDate> {
  readonly datePicker = viewChild.required(DatePicker);

  onDateSelect(date: StringDate): void {
    let finalValue: StringDate = null;

    if (date instanceof Date) {
      finalValue = date;
    } else if (typeof date === 'string' && date.trim() !== '') {
      const parsedDate = new Date(date);
      finalValue = Number.isNaN(parsedDate.getTime()) ? date : parsedDate;
    }

    this.value.set(finalValue);
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

  // Fixes an issue where it would blur input when clicking inside the overlay
  // leading to premature validation before any value had been set,
  // causing a required validation to briefly flash
  onBlur(): void {
    setTimeout(() => {
      const dp = this.datePicker();
      if (dp.overlayVisible) return;
      this.touched.set(true);
    }, 0);
  }

  onCloseOverlay(): void {
    this.touched.set(true);
  }
}
