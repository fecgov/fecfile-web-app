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
export function validateDate(schemaPath: SchemaPath<string | Date | null, 1, PathKind.Child>) {
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

@Component({
  selector: 'app-date-input',
  imports: [DatePicker, FormsModule, InputMaskModule, ButtonModule, LabelComponent],
  template: `
    <app-label [label]="label()" [inputId]="inputId()" [optional]="optional()" />
    <p-datepicker
      #datepicker
      appendTo="body"
      [attr.data-cy]="inputId()"
      [inputId]="inputId()"
      [showOnFocus]="false"
      [disabled]="disabled()"
      [(ngModel)]="value"
      (ngModelChange)="onDateSelect($event)"
      [showIcon]="true"
      [iconDisplay]="'input'"
      ariaLabelledBy="date_picker_label"
      [keepInvalid]="true"
      [autoClear]="false"
      placeholder="MM/DD/YYYY"
      pInputMask="99/99/9999"
      slotChar="MM/DD/YYYY"
      appDateSanitizer
      (onSelect)="onDateSelect($event)"
      (onBlur)="touched.set(true)"
    >
      <ng-template pTemplate="header">
        <div class="flex justify-content-between p-2 border-bottom-1 border-300">
          <div class="flex gap-1">
            @if (datepicker.currentView === 'date') {
              <button class="year-button" (click)="onYearChange($event, -1)">
                <svg height="20" width="20" class="primary-icon rotate-180">
                  <use href="assets/img/double-arrow.svg#double-arrow"></use>
                </svg>
              </button>
            }
            <button class="month-button" (click)="datepicker.onPrevButtonClick($event)">
              <svg height="14" width="14" class="rotate-180 primary-icon">
                <use href="assets/img/arrow.svg#arrow"></use>
              </svg>
            </button>
          </div>
          <div class="flex gap-2">
            @if (datepicker.currentView === 'date') {
              <button
                type="button"
                class="outlined-button"
                (click)="datepicker.switchToMonthView($event)"
                (keydown)="datepicker.onContainerButtonKeydown($event)"
                [attr.disabled]="datepicker.switchViewButtonDisabled() ? '' : undefined"
                [attr.aria-label]="datepicker.getTranslation('chooseMonth')"
                [attr.data-pc-group-section]="'navigator'"
                pRipple
              >
                {{ datepicker.getMonthName(datepicker.currentMonth) }}
              </button>
            }
            @if (datepicker.currentView !== 'year') {
              <button
                type="button"
                class="outlined-button fec-datepicker-select-year"
                (click)="datepicker.switchToYearView($event)"
                (keydown)="datepicker.onContainerButtonKeydown($event)"
                [attr.disabled]="datepicker.switchViewButtonDisabled() ? '' : undefined"
                [attr.aria-label]="datepicker.getTranslation('chooseYear')"
                [attr.data-pc-group-section]="'navigator'"
                pRipple
              >
                {{ datepicker.currentYear }}
              </button>
            }
          </div>
          <div class="flex gap-1">
            <button class="month-button" (click)="datepicker.onNextButtonClick($event)">
              <svg height="14" width="14" class="primary-icon">
                <use href="assets/img/arrow.svg#arrow"></use>
              </svg>
            </button>
            @if (datepicker.currentView === 'date') {
              <button class="year-button" (click)="onYearChange($event, 1)">
                <svg height="20" width="20" class="primary-icon">
                  <use href="assets/img/double-arrow.svg#double-arrow"></use>
                </svg>
              </button>
            }
          </div>
        </div>
      </ng-template>
      <ng-template #inputicon let-clickCallBack="clickCallBack">
        <div
          class="calendar-icon-mask"
          aria-label="Calendar"
          (click)="clickCallBack($event)"
          (keypress)="clickCallBack($event)"
        ></div>
      </ng-template>
    </p-datepicker>
    @if (touched() && invalid()) {
      <small class="p-error" role="alert">{{ errors()[0].message }}</small>
    }
  `,
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
