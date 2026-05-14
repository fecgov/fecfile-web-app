import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';
import { DateUtils } from 'app/shared/utils/date.utils';

export type DSN = Date | string | null;

@Directive({
  selector: 'p-datepicker[appDateSanitizer]',
})
export class DateSanitizerDirective {
  private readonly ngControl = inject(NgControl);
  constructor() {
    const accessor = this.ngControl?.valueAccessor;
    if (!accessor) return;
    const originalRegisterOnChange = accessor.registerOnChange.bind(accessor);
    accessor.registerOnChange = (fn: (value: DSN) => void) => {
      originalRegisterOnChange((value: DSN) => {
        if (value === 'MM/DD/YYYY' || !value) {
          return fn(null);
        }

        if (typeof value === 'string' && value.length === 10 && !/[MDY]/.test(value)) {
          const parsedDate = DateUtils.parseDate(value);
          return fn(parsedDate || value);
        }

        return fn(value);
      });
    };
  }
}
