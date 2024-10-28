import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, Observable, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommitteeAccount } from '../models/committee-account.model';
import { F3xCoverageDates, Form3X } from '../models/form-3x.model';
import { ApiService } from './api.service';
import { ReportService } from './report.service';
import { Report } from '../models/report.model';
import { F3xReportCodes } from '../utils/report-code.utils';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  f3xReportCodeLabelMap$ = new BehaviorSubject<{ [key in F3xReportCodes]: string } | undefined>(undefined);

  constructor(
    override apiService: ApiService,
    override store: Store,
  ) {
    super(apiService, store);
  }

  public async getF3xCoverageDates(): Promise<F3xCoverageDates[]> {
    const [response, reportCodeLabelMap] = await Promise.all([
      firstValueFrom(this.apiService.get<F3xCoverageDates[]>(`${this.apiEndpoint}/coverage_dates`)),
      this.getReportCodeLabelMap(),
    ]);
    return response.map((fx3CoverageDate) =>
      F3xCoverageDates.fromJSON(fx3CoverageDate, reportCodeLabelMap[fx3CoverageDate.report_code!]),
    );
  }

  public async getReportCodeLabelMap(): Promise<{ [key in F3xReportCodes]: string }> {
    let map = this.f3xReportCodeLabelMap$.getValue();
    if (!map) {
      map = await firstValueFrom(
        this.apiService.get<{ [key in F3xReportCodes]: string }>(`${this.apiEndpoint}/report_code_map`),
      );
      this.f3xReportCodeLabelMap$.next(map);
    }
    return map;
  }

  public getFutureReports(coverage_through_date: string): Observable<Form3X[]> {
    return this.apiService
      .get<Form3X[]>(`${this.apiEndpoint}/future?after=${coverage_through_date}`)
      .pipe(map((response) => response.map((r) => Form3X.fromJSON(r))));
  }

  public override fecUpdate(report: Form3X, committeeAccount?: CommitteeAccount): Observable<Report> {
    const payload: Form3X = Form3X.fromJSON({
      ...report,
      qualified_committee: committeeAccount?.qualified,
      committee_name: committeeAccount?.name,
      street_1: committeeAccount?.street_1,
      street_2: committeeAccount?.street_2,
      city: committeeAccount?.city,
      state: committeeAccount?.state,
      zip: committeeAccount?.zip,
    });
    return this.update(payload, [
      'qualified_committee',
      'committee_name',
      'street_1',
      'street_2',
      'city',
      'state',
      'zip',
    ]);
  }
}
