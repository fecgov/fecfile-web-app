import { Injectable } from '@angular/core';
import { QueryParams } from './api.service';
import { ListRestResponse } from '../models/rest-api.model';
import { TransactionListService } from './transaction-list.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchCService extends TransactionListService {
  override getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    // The table data for the Schedule C loans also includes the Schedule D debts.
    params['schedules'] = 'C,D';
    return super.getTableData(pageNumber, ordering, params);
  }
}
