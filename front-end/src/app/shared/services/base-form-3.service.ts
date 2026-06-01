import { Injectable, InjectionToken } from '@angular/core';
import { getReportFromJSON, ReportService } from './report.service';
import { BaseForm3, CoverageDates } from '../models/reports/base-form-3';
import { BehaviorSubject } from 'rxjs';
import { ReportCodes } from '../utils/report-code.utils';
import { CommitteeAccount } from '../models';

export const FORM_3_SERVICE = new InjectionToken<BaseForm3Service<BaseForm3>>('FORM_3_SERVICE');

@Injectable({
  providedIn: 'root',
})
export class BaseForm3Service<T extends BaseForm3> extends ReportService<T> {
  reportCodeLabelMap$ = new BehaviorSubject<{ [key in ReportCodes]: string } | undefined>(undefined);

  public async getCoverageDates(): Promise<CoverageDates[]> {
    const [response, reportCodeLabelMap] = await Promise.all([
      this.apiService.get<CoverageDates[]>(`${this.apiEndpoint}/coverage_dates/`),
      this.getReportCodeLabelMap(),
    ]);
    return response.map((f3CoverageDate) =>
      CoverageDates.fromJSON(f3CoverageDate, reportCodeLabelMap[f3CoverageDate.report_code!]),
    );
  }

  public async getReportCodeLabelMap(): Promise<{ [key in ReportCodes]: string }> {
    let map = this.reportCodeLabelMap$.getValue();
    if (!map) {
      map = await this.apiService.get<{ [key in ReportCodes]: string }>(`${this.apiEndpoint}/report_code_map/`);

      this.reportCodeLabelMap$.next(map);
    }
    return map;
  }

  public getFinalReport(year: number): Promise<T | undefined> {
    return this.apiService.get<T | undefined>(`${this.apiEndpoint}/final/?year=${year}`);
  }

  public async getFutureReports(coverage_through_date: string): Promise<T[]> {
    const response = await this.apiService.get<T[]>(`${this.apiEndpoint}/future/?after=${coverage_through_date}`);
    return response.map((r) => getReportFromJSON(r));
  }

  public override fecUpdate(report: T, committeeAccount?: CommitteeAccount): Promise<T> {
    const payload: T = getReportFromJSON({
      ...report,
      qualified_committee: report.qualified_committee ?? committeeAccount?.qualified,
      committee_name: report.committee_name ?? committeeAccount?.name,
      street_1: report.street_1 ?? committeeAccount?.street_1,
      street_2: report.street_2 ?? committeeAccount?.street_2,
      city: report.city ?? committeeAccount?.city,
      state: report.state ?? committeeAccount?.state,
      zip: report.zip ?? committeeAccount?.zip,
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
