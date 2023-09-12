import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { F3xCoverageDates, F3xReport } from '../models/report-types/f3x-report.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class F3xReportService {
  constructor(private apiService: ApiService) {}

  public getF3xCoverageDates(): Observable<F3xCoverageDates[]> {
    return this.apiService
      .get<F3xCoverageDates[]>(`/f3x-summaries/coverage_dates`)
      .pipe(map((response) => response.map((fx3CoverageDate) => F3xCoverageDates.fromJSON(fx3CoverageDate))));
  }

  public get(id: string): Observable<F3xReport> {
    return this.apiService.get<F3xReport>(`/f3x-summaries/${id}`).pipe(map((response) => F3xReport.fromJSON(response)));
  }

  public create(f3xReport: F3xReport, fieldsToValidate: string[] = []): Observable<F3xReport> {
    const payload = f3xReport.toJson();
    return this.apiService
      .post<F3xReport>(`/f3x-summaries/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => F3xReport.fromJSON(response)));
  }

  public update(f3xReport: F3xReport, fieldsToValidate: string[] = []): Observable<F3xReport> {
    const payload = f3xReport.toJson();
    return this.apiService
      .put<F3xReport>(`/f3x-summaries/${f3xReport.id}/`, payload, { fields_to_validate: fieldsToValidate.join(',') })
      .pipe(map((response) => F3xReport.fromJSON(response)));
  }

  public delete(F3xReport: F3xReport): Observable<null> {
    return this.apiService.delete<null>(`/f3x-summaries/${F3xReport.id}`);
  }
}
