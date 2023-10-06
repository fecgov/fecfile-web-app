import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from './report.service';
import { F3xCoverageDates, ReportF3X } from '../models/report-f3x.model';
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

  public get(id: string): Observable<ReportF3X> {
    return this.apiService.get<ReportF3X>(`/f3x-summaries/${id}`).pipe(map((response) => ReportF3X.fromJSON(response)));
  }

  public create(f3xSummary: ReportF3X, fieldsToValidate: string[] = []): Observable<ReportF3X> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .post<ReportF3X>(`/f3x-summaries/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => ReportF3X.fromJSON(response)));
  }

  public update(f3xSummary: ReportF3X, fieldsToValidate: string[] = []): Observable<ReportF3X> {
    const payload = f3xSummary.toJson();
    return this.apiService
      .put<ReportF3X>(`/f3x-summaries/${f3xSummary.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => ReportF3X.fromJSON(response)));
  }

  public delete(f3xSummary: ReportF3X): Observable<null> {
    return this.apiService.delete<null>(`/f3x-summaries/${f3xSummary.id}`);
  }
}
