import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { F3xCoverageDates, F3xSummary } from '../models/f3x-summary.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class F3xSummaryService {
  constructor(private apiService: ApiService) {}

  public getF3xCoverageDates(): Observable<F3xCoverageDates[]> {
    return this.apiService
      .get<F3xCoverageDates[]>(`/f3x-summaries/coverage_dates`)
      .pipe(map((response) => response.map((fx3CoverageDate) => F3xCoverageDates.fromJSON(fx3CoverageDate))));
  }

  public get(id: string): Observable<F3xSummary> {
    return this.apiService
      .get<F3xSummary>(`/f3x-summaries/${id}`)
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public create(f3xSummary: F3xSummary, fieldsToValidate: string[] = []): Observable<F3xSummary> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .post<F3xSummary>(`/f3x-summaries/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public update(f3xSummary: F3xSummary, fieldsToValidate: string[] = []): Observable<F3xSummary> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .put<F3xSummary>(`/f3x-summaries/${f3xSummary.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => F3xSummary.fromJSON(response)));
  }

  public startAmendment(f3xSummary: F3xSummary): Observable<string> {
    return this.apiService.post(`/f3x-summaries/${f3xSummary.id}/amend/`, {});
  }

  public delete(f3xSummary: F3xSummary): Observable<null> {
    return this.apiService.delete<null>(`/f3x-summaries/${f3xSummary.id}`);
  }
}
