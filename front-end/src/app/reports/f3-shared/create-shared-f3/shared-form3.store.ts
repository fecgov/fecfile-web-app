import { computed, inject, Injectable, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { map } from 'rxjs';

export const currentYear = new Date().getFullYear();

@Injectable()
export class SharedForm3Store {
  private readonly activeService = inject(FORM_3_SERVICE);
  private readonly route = inject(ActivatedRoute);

  readonly report = toSignal(
    this.route.data.pipe(map((data) => (data['report'] as BaseForm3 | null | undefined) ?? null)),
  );
  readonly isF3X = this.activeService.isF3X;

  readonly existingCoverage = resource({
    params: () => this.report(),
    loader: async ({ params }) => {
      const existingCoverage = await this.activeService.getCoverageDates();
      if (params === null) return existingCoverage;
      return existingCoverage.filter(
        (coverage) => coverage.coverage_from_date?.getTime() !== params?.coverage_from_date?.getTime(),
      );
    },
  });

  readonly reportCodeLabelMap = resource({
    loader: () => this.activeService.getReportCodeLabelMap(),
  });

  readonly usedReportCodes = computed(() => {
    const existingCoverage = this.existingCoverage.value();
    if (!existingCoverage) return [];
    return existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(currentYear)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
  });

  readonly disabledReportCodes = computed(() => {
    return Object.values(ReportCodes).reduce(
      (accumulator, currentCode) => {
        accumulator[currentCode] = this.checkDisableReportCode(currentCode);
        return accumulator;
      },
      {} as { [key in ReportCodes]: boolean },
    );
  });

  private checkDisableReportCode(reportCode: ReportCodes) {
    if (this.report()?.report_code === reportCode) return false;
    return this.usedReportCodes().includes(reportCode);
  }

  readonly title = computed(() => (this.isF3X ? 'Form 3X' : 'Form 3'));
  readonly subLabel = computed(() =>
    this.isF3X
      ? 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE'
      : 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE',
  );
}
