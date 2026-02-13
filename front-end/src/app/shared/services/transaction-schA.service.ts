import { Injectable } from '@angular/core';
import type { ListRestResponse } from '../models/rest-api.model';
import { TransactionListService } from './transaction-list.service';

@Injectable()
export class TransactionSchAService extends TransactionListService {
  override getTableData(
    pageNumber?: number,
    ordering?: string,
    params?: { [param: string]: string | number | boolean | readonly (string | number | boolean)[] },
  ): Promise<ListRestResponse> {
    return super.getTableData(pageNumber, ordering, { ...params, schedules: 'A' });
  }
}
