import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { Transaction } from '../models/transaction.model';
import { ListRestResponse } from '../models/rest-api.model';
import { ApiService } from './api.service';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';

function getScheduleClass(scheduleId: string): Transaction {
  switch (scheduleId) {
    case 'A': {
      return new SchATransaction();
    }
    case 'B': {
      return new SchBTransaction();
    }
  }
  throw new Error(`Class transaction for Schedule '${scheduleId}' not found`);
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
      .get<ListRestResponse>(`/sch-a-transactions/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => SchATransaction.fromJSON(item));
          return response;
        })
      );
  }

  public get(id: string, scheduleId: string): Observable<Transaction> {
    const txnClass = getScheduleClass(scheduleId);
    return this.apiService.get<typeof txnClass>(`${txnClass.apiEndpoint}/${id}/`).pipe(
      map((response) => {
        const txn = txnClass.getJSON(response);

        // Convert child JSON transaction objects into class transaction objects
        if (txn.children) {
          txn.children = txn.children.map((child: Transaction) => txnClass.getJSON(child));
        }

        return txn;
      })
    );
  }

  public getPreviousTransaction(
    transaction_id: string,
    contact_id: string,
    contribution_date: Date,
    aggregation_group: string
  ): Observable<SchATransaction> {
    const contributionDateString: string = this.datePipe.transform(contribution_date, 'yyyy-MM-dd') || '';
    return this.apiService
      .get<SchATransaction>(`/sch-a-transactions/previous/`, {
        transaction_id,
        contact_id,
        contribution_date: contributionDateString,
        aggregation_group,
      })
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public create(schATransaction: SchATransaction): Observable<SchATransaction> {
    const payload = schATransaction.toJson();
    return this.apiService
      .post<SchATransaction>(`/sch-a-transactions/`, payload)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public update(schATransaction: SchATransaction): Observable<SchATransaction> {
    const payload = schATransaction.toJson();
    return this.apiService
      .put<SchATransaction>(`/sch-a-transactions/${schATransaction.id}/`, payload)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public delete(schATransaction: SchATransaction): Observable<null> {
    return this.apiService.delete<null>(`/sch-a-transactions/${schATransaction.id}`);
  }
}
