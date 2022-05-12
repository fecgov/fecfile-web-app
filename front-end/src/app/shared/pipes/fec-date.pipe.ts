import { Pipe, PipeTransform } from '@angular/core';
import { DateTime } from 'luxon';

@Pipe({
  name: 'fecDate',
})
export class FecDatePipe implements PipeTransform {
  transform(value: string): string {
    if (!value) {
      return '';
    }
    const date = DateTime.fromFormat(value, 'yyyyMMdd');
    return date.toFormat('MM/dd/yyyy');
  }
}
