import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommitteeAccount } from '../models/committee-account.model';
import { F3xCoverageDates, F3xQualifiedCommitteeTypeCodes, Form3X } from '../models/form-3x.model';
import { ApiService } from './api.service';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  constructor(
    override apiService: ApiService,
    override store: Store,
  ) {
    super(apiService, store);
  }

  public getF3xCoverageDates(): Observable<F3xCoverageDates[]> {
    return this.apiService
      .get<F3xCoverageDates[]>(`${this.apiEndpoint}/coverage_dates`)
      .pipe(map((response) => response.map((fx3CoverageDate) => F3xCoverageDates.fromJSON(fx3CoverageDate))));
  }

  public getFutureReports(coverage_through_date: string): Observable<Form3X[]> {
    return this.apiService
      .get<Form3X[]>(`${this.apiEndpoint}/future?after=${coverage_through_date}`)
      .pipe(map((response) => response.map((r) => Form3X.fromJSON(r))));
  }

  public isQualifiedCommittee(committeeAccount?: CommitteeAccount) {
    return !!committeeAccount?.committee_type &&
      F3xQualifiedCommitteeTypeCodes.includes(committeeAccount.committee_type);
  }
}
