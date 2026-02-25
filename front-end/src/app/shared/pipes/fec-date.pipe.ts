import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'fecDate' })
export class FecDatePipe implements PipeTransform {
  transform(value: Date | undefined): string {
    if (!value) return '';
    return new Intl.DateTimeFormat('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    }).format(new Date(value));
  }
}
