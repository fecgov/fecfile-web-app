import { Injectable } from '@angular/core';
import { TransactionService } from './transaction.service';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchAService extends TransactionService {
  override tableDataEndpoint = '/transactions';

  override getTableData(
    pageNumber?: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] },
  ): Promise<ListRestResponse> {
    return super.getTableData(pageNumber, ordering, { ...params, schedules: 'A' });
  }
}
