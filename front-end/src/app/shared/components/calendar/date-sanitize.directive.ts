import { Directive, inject } from '@angular/core';
import { NgControl } from '@angular/forms';

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
        if (value === 'MM/DD/YYYY' || !value) return fn(null);
        return fn(value);
      });
    };
  }
}
