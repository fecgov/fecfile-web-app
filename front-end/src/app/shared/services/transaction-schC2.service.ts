import { Injectable } from '@angular/core';
import { ListRestResponse } from '../models/rest-api.model';
import { SchCTransaction } from '../models/schc-transaction.model';
import { TransactionListService } from './transaction-list.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchC2Service extends TransactionListService {
  public transaction?: SchCTransaction;

  override getTableData(
    pageNumber?: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] },
  ): Promise<ListRestResponse> {
    return super.getTableData(pageNumber, ordering, { ...params, schedules: 'C2' });
  }
}
