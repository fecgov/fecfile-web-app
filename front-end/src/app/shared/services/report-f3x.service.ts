import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from './report.service';
import { F3xCoverageDates, F3xSummary } from '../models/report-f3x.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ReportF3XService {
  tableDataEndpoint = '/reports/report-f3x';

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

  public delete(f3xSummary: F3xSummary): Observable<null> {
    return this.apiService.delete<null>(`/f3x-summaries/${f3xSummary.id}`);
  }
}
