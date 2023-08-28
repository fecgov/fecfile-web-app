import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { Transaction, AggregationGroups, ScheduleTransaction } from '../models/transaction.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { getFromJSON } from '../utils/transaction-type.utils';
import { HttpResponse } from '@angular/common/http';
import { HttpStatusCode } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  tableDataEndpoint = '/transactions';

  constructor(protected apiService: ApiService, protected datePipe: DatePipe) {}

  public getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
  ): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    return this.apiService
      .get<ListRestResponse>(`${this.tableDataEndpoint}/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => getFromJSON(item));
          return response;
        })
      );
  }

  public get(id: string): Observable<ScheduleTransaction> {
    return this.apiService.get<ScheduleTransaction>(`/transactions/${id}/`).pipe(
      map((response) => {
        return getFromJSON(response);
      })
    );
  }

  public getPreviousTransaction(
    transaction: Transaction | undefined,
    contact_1_id: string,
    action_date: Date
  ): Observable<Transaction | undefined> {
    const actionDateString: string = this.datePipe.transform(action_date, 'yyyy-MM-dd') || '';
    const transaction_id: string = transaction?.id || '';
    const aggregation_group: AggregationGroups | undefined =
      (transaction as ScheduleTransaction)?.aggregation_group || AggregationGroups.GENERAL;

    if (transaction && action_date && contact_1_id && aggregation_group) {
      return this.apiService
        .get<HttpResponse<Transaction>>(
          '/transactions/previous/',
          {
            transaction_id,
            contact_1_id,
            date: actionDateString,
            aggregation_group,
          },
          [HttpStatusCode.NotFound]
        )
        .pipe(
          map((response) => {
            if (response.status === HttpStatusCode.NotFound) {
              return undefined;
            }
            return getFromJSON(response.body);
          })
        );
    }
    return of(undefined);
  }

  public create(transaction: Transaction): Observable<Transaction> {
    const payload = this.preparePayload(transaction);
    return this.apiService
      .post<Transaction>(`${transaction.transactionType?.apiEndpoint}/`, payload)
      .pipe(map((response) => getFromJSON(response)));
  }

  public update(transaction: Transaction): Observable<Transaction> {
    const payload = this.preparePayload(transaction);
    return this.apiService
      .put<Transaction>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}/`, payload)
      .pipe(map((response) => getFromJSON(response)));
  }

  public delete(transaction: Transaction): Observable<null> {
    return this.apiService.delete<null>(`${transaction.transactionType?.apiEndpoint}/${transaction.id}`).pipe(
      tap(() => {
        if (transaction.transactionType?.updateParentOnSave && transaction.parent_transaction?.children) {
          // Remove deleted transaction from parent's list of children
          transaction.parent_transaction.children = transaction.parent_transaction.children.filter(
            (child) => child.id !== transaction.id
          );
          const parentTransactionPayload = transaction.getUpdatedParent(true);
          this.update(parentTransactionPayload).subscribe();
        }
      })
    );
  }

  /**
   * Update and prepare a transaction payload as a JSON object to be received by the API.
   * This involves removing excess properties such and transactionType while
   * moving needed data points (such as schedule_id) to the top level of the payload.
   *
   * We do this here because otherwise we are redefining data values in the
   * transaction model that we already have in the transactionType object
   * @param transaction
   */
  private preparePayload(transaction: Transaction) {
    const payload = transaction.toJson();

    // Add flags to the payload used for API processing
    if (transaction.transactionType?.scheduleId) {
      payload['schedule_id'] = transaction.transactionType.scheduleId;
    }
    if (transaction.transactionType?.useParentContact) {
      payload['use_parent_contact'] = transaction.transactionType.useParentContact;
    }

    delete payload['transactionType'];
    delete payload['report'];

    if (transaction.children) {
      payload['children'] = transaction.children.map((transaction) => this.preparePayload(transaction));
    }

    return payload;
  }
}
