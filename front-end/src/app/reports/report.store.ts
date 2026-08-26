import { computed, inject, Injectable, resource, ResourceRef } from '@angular/core';
import { Report } from 'app/shared/models/reports/report.model';
import { ReportService } from 'app/shared/services/report.service';
import { injectParams } from 'ngxtension/inject-params';

@Injectable()
export class ReportStore<T extends Report> {
  readonly reportId = injectParams('reportId');
  readonly reportService: ReportService<T> = inject(ReportService<T>);
  readonly report = resource({
    params: () => this.reportId(),
    loader: async ({ params, abortSignal }) => {
      if (params === null) return null;
      return this.reportService.get(params);
    },
  });

  readonly isActive = computed(() => this.reportId() !== null);
}
