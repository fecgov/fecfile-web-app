import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'longDate' })
export class LongDatePipe implements PipeTransform {
  transform(value: Date | null): string {
    if (!value) {
      return '';
    }
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(value);
  }
}
