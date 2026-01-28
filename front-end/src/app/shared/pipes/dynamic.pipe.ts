/* eslint-disable @typescript-eslint/no-explicit-any */

import { CurrencyPipe } from '@angular/common';
import { inject, Pipe, PipeTransform } from '@angular/core';
import { MemoCodePipe } from './memo-code.pipe';
import { FecDatePipe } from './fec-date.pipe';
import { TransactionIdPipe } from './transaction-id.pipe';
import { DefaultZeroPipe } from './default-zero.pipe';

@Pipe({ name: 'dynamic' })
export class DynamicPipe implements PipeTransform {
  private readonly currencyPipe = inject(CurrencyPipe);
  private readonly memoCodePipe = inject(MemoCodePipe);
  private readonly fecDatePipe = inject(FecDatePipe);
  private readonly transactionIdPipe = inject(TransactionIdPipe);
  private readonly defaultZeroPipe = inject(DefaultZeroPipe);

  transform(value: any, pipes: string[] | undefined, pipeArgs: any[] = []): any {
    for (const pipe of pipes || []) {
      value = this.transformPipe(value, pipe, pipeArgs);
    }
    return value;
  }

  transformPipe(value: any, pipe: string, pipeArgs: any[] = []): any {
    switch (pipe) {
      case 'currency':
        return this.currencyPipe.transform(value, ...pipeArgs);
      case 'memoCode':
        return this.memoCodePipe.transform(value);
      case 'fecDate':
        return this.fecDatePipe.transform(value);
      case 'transactionId':
        return this.transactionIdPipe.transform(value);
      case 'defaultZero':
        return this.defaultZeroPipe.transform(value);
      default:
        return value;
    }
  }
}
