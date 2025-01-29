import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { ListRestResponse } from '../models/rest-api.model';
import { SchCTransaction } from '../models/schc-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchC2Service extends TransactionService {
  override tableDataEndpoint = '/transactions';
  public transaction?: SchCTransaction;

  override getTableData(
    pageNumber?: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] },
  ): Promise<ListRestResponse> {
    return super.getTableData(pageNumber, ordering, { ...params, schedules: 'C2' });
  }
}
