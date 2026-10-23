import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ReportResolver } from 'app/shared/resolvers/report.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { BaseForm3, CoverageDates } from 'app/shared/models/reports/base-form-3';

export interface SharedForm3InitialData {
  report: BaseForm3 | null;
  existingCoverage: CoverageDates[];
}

@Injectable()
export class SharedForm3Resolver {
  private readonly reportResolver = inject(ReportResolver);
  private readonly activeService = inject(FORM_3_SERVICE);

  async resolve(route: ActivatedRouteSnapshot): Promise<SharedForm3InitialData> {
    const report = (await this.reportResolver.resolve(route)) ?? null;
    const coverage = await this.activeService.getCoverageDates();
    if (!report) return { report, existingCoverage: coverage };
    const baseF3 = report as BaseForm3;
    const existingCoverage = coverage.filter(
      (item) => item.coverage_from_date?.getTime() !== baseF3.coverage_from_date?.getTime(),
    );

    return { report: baseF3, existingCoverage };
  }
}
