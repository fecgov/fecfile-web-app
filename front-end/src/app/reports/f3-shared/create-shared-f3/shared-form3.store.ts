import { computed, inject, Injectable, resource } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import type { SharedForm3InitialData } from 'app/shared/resolvers/shared-form3.resolver';
import { FORM_3_SERVICE } from 'app/shared/services/base-form-3.service';
import { ReportCodes } from 'app/shared/utils/report-code.utils';
import { map } from 'rxjs';

export const currentYear = new Date().getFullYear();

@Injectable()
export class SharedForm3Store {
  private readonly activeService = inject(FORM_3_SERVICE);
  private readonly route = inject(ActivatedRoute);

  readonly initialData = toSignal(this.route.data.pipe(map((data) => data['initialData'] as SharedForm3InitialData)));
  readonly report = computed(() => this.initialData()?.report);
  readonly existingCoverage = computed(() => this.initialData()?.existingCoverage ?? []);

  readonly reportCodeLabelMap = resource({ loader: () => this.activeService.getReportCodeLabelMap() });

  readonly usedReportCodes = computed(() => {
    return this.existingCoverage().reduce((codes: ReportCodes[], coverage) => {
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

  readonly title = computed(() => (this.activeService.isF3X ? 'Form 3X' : 'Form 3'));
  readonly subLabel = computed(() =>
    this.activeService.isF3X
      ? 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR OTHER THAN AN AUTHORIZED COMMITTEE'
      : 'REPORT OF RECEIPTS AND DISBURSEMENTS FOR AN AUTHORIZED COMMITTEE',
  );
}
