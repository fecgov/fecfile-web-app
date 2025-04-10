import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CommitteeAccount } from '../models/committee-account.model';
import { Form3X, CoverageDates } from '../models';
import { Report } from '../models/report.model';
import { ReportCodes } from '../utils/report-code.utils';
import { ReportService } from './report.service';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  f3xReportCodeLabelMap$ = new BehaviorSubject<{ [key in ReportCodes]: string } | undefined>(undefined);

  public async getF3xCoverageDates(): Promise<CoverageDates[]> {
    const [response, reportCodeLabelMap] = await Promise.all([
      this.apiService.get<CoverageDates[]>(`${this.apiEndpoint}/coverage_dates/`),
      this.getReportCodeLabelMap(),
    ]);
    return response.map((fx3CoverageDate) =>
      CoverageDates.fromJSON(fx3CoverageDate, reportCodeLabelMap[fx3CoverageDate.report_code!]),
    );
  }

  public async getReportCodeLabelMap(): Promise<{ [key in ReportCodes]: string }> {
    let map = this.f3xReportCodeLabelMap$.getValue();
    if (!map) {
      map = await this.apiService.get<{ [key in ReportCodes]: string }>(`${this.apiEndpoint}/report_code_map/`);

      this.f3xReportCodeLabelMap$.next(map);
    }
    return map;
  }

  public async getFutureReports(coverage_through_date: string): Promise<Form3X[]> {
    const response = await this.apiService.get<Form3X[]>(`${this.apiEndpoint}/future/?after=${coverage_through_date}`);
    return response.map((r) => Form3X.fromJSON(r));
  }

  public getFinalReport(year: number): Promise<Form3X | undefined> {
    return this.apiService.get<Form3X | undefined>(`${this.apiEndpoint}/final/?year=${year}`);
  }

  public override fecUpdate(report: Form3X, committeeAccount?: CommitteeAccount): Promise<Report> {
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
