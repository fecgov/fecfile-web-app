import { Injectable } from '@angular/core';
import { ListRestResponse } from '../models';
import { QueryParams } from './api.service';
import { TransactionListService } from './transaction-list.service';

@Injectable({
  providedIn: 'root',
})
export class UnassociatedTransactionListService extends TransactionListService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  override async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    /*if (!ordering) {
      ordering = 'line_label,created';
    }
    if (ordering === '-line_label,created') {
      ordering = '-line_label,-created';
    }

    const response = await this.apiService.get<ListRestResponse>(
      `/transactions/list/unassociated/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map((item) => TransactionListRecord.fromJSON(item));
    response.pageNumber = pageNumber;
    return response;*/

    // Stubbing out the return for the moment, since the tables aren't yet configured for real use
    return {
      count: 0,
      next: '',
      previous: '',
      pageNumber: 1,
      results: [],
    };
  }
}
