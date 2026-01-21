/* eslint-disable @typescript-eslint/no-explicit-any */

import { CurrencyPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { MemoCodePipe } from './memo-code.pipe';
import { FecDatePipe } from './fec-date.pipe';
import { TransactionIdPipe } from './transaction-id.pipe';

@Pipe({ name: 'dynamic' })
export class DynamicPipe implements PipeTransform {
  private currencyPipe = inject(CurrencyPipe);
  private memoCodePipe = inject(MemoCodePipe);
  private fecDatePipe = inject(FecDatePipe);
  private transactionIdPipe = inject(TransactionIdPipe);

  transform(value: any, pipeType: string | undefined, pipeArgs: any[] = []): any {
    switch (pipeType) {
      case 'currency':
        return this.currencyPipe.transform(value, ...pipeArgs);
      case 'memoCode':
        return this.memoCodePipe.transform(value);
      case 'fecDate':
        return this.fecDatePipe.transform(value);
      case 'transactionId':
        return this.transactionIdPipe.transform(value);
      default:
        return value;
    }
  }
}
