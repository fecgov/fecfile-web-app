import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ContactSchATransaction, SchATransaction } from '../models/scha-transaction.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class SchATransactionService {
  constructor(private apiService: ApiService) { }

  public get(id: string): Observable<SchATransaction> {
    return this.apiService
      .get<SchATransaction>(`/sch-a-transactions/${id}`)
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public create(
    contactSchATransaction: ContactSchATransaction,
    schema: string,
    fieldsToValidate: string[] = []
  ): Observable<SchATransaction> {
    const payload = contactSchATransaction.toJson();
    return this.apiService
      .post<SchATransaction>(`/sch-a-transactions/`, payload, {
        schema: schema,
        fields_to_validate: fieldsToValidate.join(','),
      })
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public update(
    contactSchATransaction: ContactSchATransaction,
    schema: string,
    fieldsToValidate: string[] = []
  ): Observable<SchATransaction> {
    const payload = contactSchATransaction.toJson();
    return this.apiService
      .put<SchATransaction>(`/sch-a-transactions/` +
        `${contactSchATransaction.transaction.id}/`, payload, {
        schema: schema,
        fields_to_validate: fieldsToValidate.join(','),
      })
      .pipe(map((response) => SchATransaction.fromJSON(response)));
  }

  public delete(schATransaction: SchATransaction): Observable<null> {
    return this.apiService.delete<null>(`/sch-a-transactions/${schATransaction.id}`);
  }
}
