import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { Transaction, AggregationGroups } from '../models/transaction.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { TransactionType } from '../models/transaction-types/transaction-type.model';

/**
 * Given the API endpoint, return the class of the relevent schedule.
 * @param key URL of root API endpoint
 * @returns Transaction subclass
 */
function getScheduleClass(apiEndpoint: string) {
  switch (apiEndpoint) {
    case '/transactions/schedule-a':
      return SchATransaction;
    case '/transactions/schedule-b':
      return SchBTransaction;
  }
  throw new Error(`Class transaction for API endpoint '${apiEndpoint}' not found`);
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  public getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
  ): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    // Pull list from Sch A Transactions until we have an endpoint that pulls transactions from the different schedule types
    return this.apiService
      .get<ListRestResponse>(`/transactions/schedule-a/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => SchATransaction.fromJSON(item));
          return response;
        })
      );
  }

  public get(id: string): Observable<SchATransaction> {
    return this.apiService.get<SchATransaction>(`/transactions/schedule-a/${id}/`).pipe(
      map((response) => {
        const txn = SchATransaction.fromJSON(response);

        // Convert child transactions into SchATransaction objects
        if (txn.children) {
          txn.children = txn.children.map((child) => SchATransaction.fromJSON(child));
        }

        return txn;
      })
    );
  }

  public getPreviousTransaction(
    transactionType: TransactionType | undefined,
    contact_id: string,
    action_date: Date
  ): Observable<Transaction | undefined> {
    const actionDateString: string = this.datePipe.transform(action_date, 'yyyy-MM-dd') || '';
    const transaction_id: string = transactionType?.transaction?.id || '';
    const aggregation_group: AggregationGroups | undefined =
      (transactionType?.transaction as SchATransaction)?.aggregation_group || AggregationGroups.GENERAL;
    const apiEndpoint: string = transactionType?.transaction?.apiEndpoint || '';
    const scheduleClass = getScheduleClass(apiEndpoint);

    if (transactionType && action_date && contact_id && aggregation_group) {
      return this.apiService
        .get<Transaction>(`${apiEndpoint}/previous/`, {
          transaction_id,
          contact_id,
          action_date: actionDateString,
          aggregation_group,
        })
        .pipe(map((response) => scheduleClass.fromJSON(response)));
    }
    return of(undefined);
  }

  public create(transaction: Transaction): Observable<Transaction> {
    const payload = transaction.toJson();
    const scheduleClass = getScheduleClass(transaction.apiEndpoint);
    return this.apiService
      .post<Transaction>(`${transaction.apiEndpoint}/`, payload)
      .pipe(map((response) => scheduleClass.fromJSON(response)));
  }

  public update(transaction: Transaction): Observable<Transaction> {
    const payload = transaction.toJson();
    const scheduleClass = getScheduleClass(transaction.apiEndpoint);
    return this.apiService
      .put<Transaction>(`${transaction.apiEndpoint}/${transaction.id}/`, payload)
      .pipe(map((response) => scheduleClass.fromJSON(response)));
  }

  public delete(transaction: Transaction): Observable<null> {
    return this.apiService.delete<null>(`${transaction.apiEndpoint}/${transaction.id}`).pipe(
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
}
