import { inject, Injectable } from '@angular/core';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models';
import { TransactionListRecord } from '../models/transaction-list-record.model';
import { ApiService, QueryParams } from './api.service';
import { HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Report } from '../models/reports/report.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionListService implements TableListService<TransactionListRecord> {
  protected readonly apiService = inject(ApiService);
  tableDataEndpoint = '/transactions';

  public async getTableData(pageNumber = 1, ordering = '', params: QueryParams = {}): Promise<ListRestResponse> {
    if (!ordering) {
      ordering = 'line_label,created';
    }
    if (ordering === '-line_label,created') {
      ordering = '-line_label,-created';
    }

    const response = await this.apiService.get<ListRestResponse>(
      `${this.tableDataEndpoint}/?page=${pageNumber}&ordering=${ordering}`,
      params,
    );
    response.results = response.results.map((item) => TransactionListRecord.fromJSON(item));
    response.pageNumber = pageNumber;
    return response;
  }

  delete(transaction: TransactionListRecord): Promise<null> {
    return this.apiService.delete<null>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`);
  }

  async itemize(transaction: TransactionListRecord, force_itemized: boolean): Promise<string> {
    return this.apiService.put<string>(
      `${transaction.transactionType?.apiEndpoint}/${transaction.id}/update-itemization-aggregation/`,
      {
        force_itemized,
        schedule_id: transaction.transactionType.scheduleId,
        schema_name: transaction.transactionType.getSchemaName(),
      },
    );
  }

  async unaggregate(transaction: TransactionListRecord, force_unaggregated: boolean): Promise<string> {
    return this.apiService.put<string>(
      `${transaction.transactionType?.apiEndpoint}/${transaction.id}/update-itemization-aggregation/`,
      {
        force_unaggregated,
        schedule_id: transaction.transactionType.scheduleId,
        schema_name: transaction.transactionType.getSchemaName(),
      },
    );
  }

  addToReport(transaction: TransactionListRecord, report: Report): Promise<HttpResponse<string>> {
    const payload = {
      report_id: report.id,
      transaction_id: transaction.id,
    };
    return this.apiService.post<string>(`${transaction.transactionType?.apiEndpoint}/add-to-report/`, payload, {}, [
      HttpStatusCode.Accepted,
      HttpStatusCode.NotFound,
      HttpStatusCode.BadRequest,
    ]);
  }
}
