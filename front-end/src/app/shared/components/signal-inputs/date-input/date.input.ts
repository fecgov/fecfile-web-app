import { Component, viewChild } from '@angular/core';
import { DatePicker } from 'primeng/datepicker';
import { BaseInput } from '../base.input';
import { FormsModule } from '@angular/forms';
import { InputMaskModule } from 'primeng/inputmask';
import { ButtonModule } from 'primeng/button';
import { LabelComponent } from '../label.component';
import { PathKind, SchemaPath, validate } from '@angular/forms/signals';

export type StringDate = Date | string | null;
const invalidDateMessage = 'This date does not follow the correct format, e.g. 01/01/2020';
export function validateDate(schemaPath: SchemaPath<StringDate, 1, PathKind.Child>) {
  validate(schemaPath, ({ value }) => {
    let rawValue = value();
    if (!rawValue) return null;
    if (typeof rawValue === 'string') {
      // Fixes paste issue
      if (rawValue.includes('MM/DD/YYYY')) rawValue = rawValue.replaceAll('MM/DD/YYYY', '');
      const parsedTimestamp = Date.parse(rawValue);
      if (Number.isNaN(parsedTimestamp) || /[a-zA-Z]/.test(rawValue)) {
        return { kind: 'pattern', message: invalidDateMessage };
      }
    }

    if (rawValue instanceof Date && Number.isNaN(rawValue.getTime())) {
      return { kind: 'pattern', message: invalidDateMessage };
    }

    return null;
  });
}

export function validateDateAfter(dateSchema: SchemaPath<StringDate>, otherDateSchema: SchemaPath<StringDate>) {
  validate(dateSchema, (ctx) => {
    const date = ctx.value();
    const otherDate = ctx.valueOf(otherDateSchema);
    if (!date || !otherDate || typeof date === 'string' || typeof otherDate === 'string') return null;

    return otherDate.getTime() > date.getTime()
      ? {
          kind: 'isAfter',
          message: `${ctx.pathKeys()[1].toUpperCase()} must be after ${(ctx.stateOf(otherDateSchema).keyInParent() as string).toUpperCase()}`,
        }
      : null;
  });
}

@Component({
  selector: 'app-date-input',
  imports: [DatePicker, FormsModule, InputMaskModule, ButtonModule, LabelComponent],
  templateUrl: 'date.input.html',
  styleUrls: ['../input.scss', './date.input.scss'],
})
export class DateInput extends BaseInput<StringDate> {
  readonly datePicker = viewChild.required(DatePicker);

  onModelChange(date: StringDate): void {
    let finalValue: StringDate = null;

    if (date instanceof Date) {
      finalValue = date;
    } else if (typeof date === 'string' && date.trim() !== '') {
      const parsedDate = new Date(date);
      finalValue = Number.isNaN(parsedDate.getTime()) ? date : parsedDate;
    }

    this.value.set(finalValue);
    this.touched.set(true);
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
