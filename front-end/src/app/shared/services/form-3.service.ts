import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { F3CoverageDates, Form3 } from '../models/form-3.model';
import { Report } from '../models/report.model';
import { ReportCodes } from '../utils/report-code.utils';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form3Service extends ReportService {
  override apiEndpoint = '/reports/form-3';

  f3ReportCodeLabelMap$ = new BehaviorSubject<{ [key in ReportCodes]: string } | undefined>(undefined);

  public async getF3CoverageDates(): Promise<F3CoverageDates[]> {
    const [response, reportCodeLabelMap] = await Promise.all([
      this.apiService.get<F3CoverageDates[]>(`${this.apiEndpoint}/coverage_dates/`),
      this.getReportCodeLabelMap(),
    ]);
    return response.map((f3CoverageDate) =>
      F3CoverageDates.fromJSON(f3CoverageDate, reportCodeLabelMap[f3CoverageDate.report_code!]),
    );
  }

  public async getReportCodeLabelMap(): Promise<{ [key in ReportCodes]: string }> {
    let map = this.f3ReportCodeLabelMap$.getValue();
    if (!map) {
      map = await this.apiService.get<{ [key in ReportCodes]: string }>(`${this.apiEndpoint}/report_code_map/`);

      this.f3ReportCodeLabelMap$.next(map);
    }
    return map;
  }

  public async getFutureReports(coverage_through_date: string): Promise<Form3[]> {
    const response = await this.apiService.get<Form3[]>(`${this.apiEndpoint}/future/?after=${coverage_through_date}`);
    return response.map((r) => Form3.fromJSON(r));
  }

  public getFinalReport(year: number): Promise<Form3 | undefined> {
    return this.apiService.get<Form3 | undefined>(`${this.apiEndpoint}/final/?year=${year}`);
  }

  public override fecUpdate(report: Form3, committeeAccount?: CommitteeAccount): Promise<Report> {
    const payload: Form3 = Form3.fromJSON({
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
