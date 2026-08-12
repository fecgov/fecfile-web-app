import { Injectable } from '@angular/core';
import { ListRestResponse } from '../models';
import { TransactionListRecord } from '../models/transaction-list-record.model';
import { QueryParams } from './api.service';
import { TransactionListService } from './transaction-list.service';

@Injectable({
  providedIn: 'root',
})
export class UnassociatedTransactionListService extends TransactionListService {
  override async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    if (!ordering) {
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
    return response;
  }
}
