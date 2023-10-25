import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReportService } from './report.service';
import { F3xCoverageDates } from '../models/form-3x.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  constructor(override apiService: ApiService, override store: Store) {
    super(apiService, store);
  }

  public getF3xCoverageDates(): Observable<F3xCoverageDates[]> {
    return this.apiService
      .get<F3xCoverageDates[]>(`${this.apiEndpoint}/coverage_dates`)
      .pipe(map((response) => response.map((fx3CoverageDate) => F3xCoverageDates.fromJSON(fx3CoverageDate))));
  }
}
