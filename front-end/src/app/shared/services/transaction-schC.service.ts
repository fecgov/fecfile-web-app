import { Injectable } from '@angular/core';
import { QueryParams } from './api.service';
import { TransactionService } from './transaction.service';
import { ListRestResponse } from '../models/rest-api.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionSchCService extends TransactionService {
  override tableDataEndpoint = '/transactions';

  override getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    // The table data for the Schedule C loans also includes the Schedule D debts.
    params['schedules'] = 'C,D';
    return super.getTableData(pageNumber, ordering, params);
  }
}
