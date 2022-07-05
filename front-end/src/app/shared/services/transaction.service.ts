import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TableListService } from '../interfaces/table-list-service.interface';
import { ListRestResponse } from '../models/rest-api.model';
import { Transaction } from '../interfaces/transaction.interface';
import { SchATransactionService } from './scha-transaction.service';
import { SchATransaction } from '../models/scha-transaction.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService implements TableListService<Transaction> {
  constructor(private apiService: ApiService, private schATransactionService: SchATransactionService) {}

  public getTableData(
    pageNumber = 1,
    ordering = '',
    params: { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } = {}
  ): Observable<ListRestResponse> {
    if (!ordering) {
      ordering = 'form_type';
    }
    // Pull list from Sch A Transactions until we have more report models built
    return this.apiService
      .get<ListRestResponse>(`/sch-a-transactions/?page=${pageNumber}&ordering=${ordering}`, params)
      .pipe(
        map((response: ListRestResponse) => {
          response.results = response.results.map((item) => SchATransaction.fromJSON(item));
          return response;
        })
      );
  }

  public get(transactionId: number): Observable<Transaction> {
    return this.schATransactionService.get(transactionId);
  }

  public create(transaction: Transaction, schema: string, fieldsToValidate: string[] = []): Observable<Transaction> {
    return this.schATransactionService.create(transaction as SchATransaction, schema, fieldsToValidate);
  }

  public update(transaction: Transaction, schema: string, fieldsToValidate: string[] = []): Observable<Transaction> {
    return this.schATransactionService.update(transaction as SchATransaction, schema, fieldsToValidate);
  }

  public delete(transaction: Transaction): Observable<null> {
    return this.schATransactionService.delete(transaction as SchATransaction);
  }
}
