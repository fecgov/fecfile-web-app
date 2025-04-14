import { computed, Injectable } from '@angular/core';
import { CommitteeAccount } from '../models/committee-account.model';
import { Form3X, CoverageDates } from '../models';
import { Report } from '../models/report.model';
import { ReportCodes } from '../utils/report-code.utils';
import { ReportService } from './report.service';
import { derivedAsync } from 'ngxtension/derived-async';

@Injectable({
  providedIn: 'root',
})
export class Form3XService extends ReportService {
  override apiEndpoint = '/reports/form-3x';

  readonly reportCodeLabelMap = derivedAsync(() =>
    this.apiService.get<{ [key in ReportCodes]: string }>(`${this.apiEndpoint}/report_code_map/`),
  );
  private readonly coverage = derivedAsync(() =>
    this.apiService.get<CoverageDates[]>(`${this.apiEndpoint}/coverage_dates/`),
  );
  readonly existingCoverage = computed(() => {
    const map = this.reportCodeLabelMap();
    const coverage = this.coverage();
    if (!map || !coverage) return undefined;
    return coverage.map((fx3CoverageDate) =>
      CoverageDates.fromJSON(fx3CoverageDate, map[fx3CoverageDate.report_code!]),
    );
  });

  readonly reportType = computed(() => {
    const map = this.reportCodeLabelMap();
    if (!map) return '';
    return map[this.reportCode()];
  });

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
