import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'transactionId' })
export class TransactionIdPipe implements PipeTransform {
  transform(value: string | null) {
    if (value) {
      return value.substring(0, 8).toUpperCase();
    }
    return '';
  }
}
