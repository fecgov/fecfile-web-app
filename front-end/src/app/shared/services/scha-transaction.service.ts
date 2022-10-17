import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { SchATransaction } from '../models/scha-transaction.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SchATransactionService {
  constructor(private apiService: ApiService, private datePipe: DatePipe) {}

  public get(id: string): Observable<SchATransaction> {
    return this.apiService
      .get<SchATransaction>(`/sch-a-transactions/${id}/`)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
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
