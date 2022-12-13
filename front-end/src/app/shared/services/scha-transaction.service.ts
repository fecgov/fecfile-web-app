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
    transaction_id: string,
    contact_id: string,
    contribution_date: Date,
    aggregation_group: string
  ): Observable<SchATransaction> {
    const contributionDateString: string = this.datePipe.transform(contribution_date, 'yyyy-MM-dd') || '';
    return this.apiService
      .get<SchATransaction>(`/transactions/schedule-a/previous/`, {
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
      .post<SchATransaction>(`/transactions/schedule-a/`, payload)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public update(schATransaction: SchATransaction): Observable<SchATransaction> {
    const payload = schATransaction.toJson();
    return this.apiService
      .put<SchATransaction>(`/transactions/schedule-a/${schATransaction.id}/`, payload)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public delete(schATransaction: SchATransaction): Observable<null> {
    return this.apiService.delete<null>(`/transactions/schedule-a/${schATransaction.id}`);
  }
}
