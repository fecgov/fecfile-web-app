import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService } from './api.service';
import { F3xSummary } from '../models/f3x-summary.model';

@Injectable({
  providedIn: 'root',
})
export class F3xSummaryService {
  constructor(private apiService: ApiService) {}

  public get(id: number): Observable<F3xSummary> {
    return this.apiService
      .get<F3xSummary>(`/f3x-summaries/${id}`)
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public create(f3xSummary: F3xSummary, fieldsToValidate: string[] = []): Observable<F3xSummary> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .post<F3xSummary>(`/f3x-summaries/`, payload, { fields_to_validate: fieldsToValidate })
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public update(f3xSummary: F3xSummary, fieldsToValidate: string[] = []): Observable<F3xSummary> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .put<F3xSummary>(`/f3x-summaries/${f3xSummary.id}/`, payload, { fields_to_validate: fieldsToValidate })
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public delete(f3xSummary: F3xSummary): Observable<null> {
    return this.apiService.delete<null>(`/f3x-summaries/${f3xSummary.id}`);
  }
}
