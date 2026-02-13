import { Injectable } from '@angular/core';
import type { QueryParams } from './api.service';
import type { ListRestResponse } from '../models/rest-api.model';
import { TransactionListService } from './transaction-list.service';

@Injectable()
export class TransactionSchBService extends TransactionListService {
  override getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    // The table data for the Schedule B disbursements also includes the Schedule E expenditures.
    params['schedules'] = 'B,E,F';
    return super.getTableData(pageNumber, ordering, params);
  }
}
