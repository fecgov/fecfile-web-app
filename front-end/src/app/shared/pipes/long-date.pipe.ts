import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'longDate' })
export class LongDatePipe implements PipeTransform {
  transform(value: Date | null): string {
    if (!value) {
      return '';
    }
    const date = DateTime.fromJSDate(value);
    return date.toFormat('LLLL d, yyyy');
  }
}
