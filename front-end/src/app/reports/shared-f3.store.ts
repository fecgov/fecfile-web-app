import { computed, inject, Injectable, resource } from '@angular/core';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { ReportStore } from './report.store';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { DateUtils } from 'app/shared/utils/date.utils';

@Injectable()
export class SharedF3Store<T extends BaseForm3> extends ReportStore<T> {
  private readonly activeService = inject(FORM_3_SERVICE);
  private readonly _existingCoverage = resource({ loader: () => this.activeService.getCoverageDates() });
  readonly existingCoverage = computed(() => {
    if (this.report.isLoading() || this._existingCoverage.isLoading()) {
      return undefined;
    }
    const report = this.report.value();
    let existingCoverage = this._existingCoverage.value();
    if (!existingCoverage) return undefined;
    if (report)
      existingCoverage = existingCoverage.filter(
        (coverage) => coverage.coverage_from_date?.getTime() !== report.coverage_from_date?.getTime(),
      );

    return existingCoverage;
  });

  readonly usedReportCodes = computed(() => {
    const existingCoverage = this.existingCoverage();
    if (!existingCoverage) return new Set<ReportCodes>();
    const usedArray = existingCoverage.reduce((codes: ReportCodes[], coverage) => {
      const years = [coverage.coverage_from_date?.getFullYear(), coverage.coverage_through_date?.getFullYear()];
      if (years.includes(DateUtils.currentYear)) {
        return [...codes, coverage.report_code] as ReportCodes[];
      }
      return codes;
    }, []);
    return new Set(usedArray);
  });

  readonly disabledReportCodes = computed(() => {
    const currentCode = this.report.value()?.report_code as ReportCodes | undefined;
    const disabled = new Set(this.usedReportCodes());
    if (currentCode) disabled.delete(currentCode);
    return disabled;
  });

  firstEnabledReportCode(visibleCodes: Set<ReportCodes>) {
    const disabled = this.disabledReportCodes();
    for (const code of visibleCodes) if (!disabled.has(code)) return code;
    return null;
  }
}
