import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({ name: 'fecDate' })
export class FecDatePipe implements PipeTransform {
  transform(value: Date | undefined): string {
    if (!value) {
      return '';
    }
    const date = DateTime.fromJSDate(value);
    return date.toFormat('MM/dd/yyyy');
  }
}
