import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { SchATransaction } from '../models/scha-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class SchATransactionService {
  constructor(private apiService: ApiService) {}

  public get(id: number): Observable<SchATransaction> {
    return this.apiService
      .get<SchATransaction>(`/sch-a-transactions/${id}`)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public create(schATransaction: SchATransaction, fieldsToValidate: string[] = []): Observable<SchATransaction> {
    const payload = schATransaction.toJson();
    return this.apiService
      .post<SchATransaction>(`/sch-a-transactions/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public update(schATransaction: SchATransaction, fieldsToValidate: string[] = []): Observable<SchATransaction> {
    const payload = schATransaction.toJson();
    return this.apiService
      .put<SchATransaction>(`/sch-a-transactions/${schATransaction.id}/`, payload, {
        fields_to_validate: fieldsToValidate.join(','),
      })
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public delete(schATransaction: SchATransaction): Observable<null> {
    return this.apiService.delete<null>(`/sch-a-transactions/${schATransaction.id}`);
  }
}
