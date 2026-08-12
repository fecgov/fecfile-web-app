import { computed, Directive, effect, inject, signal, viewChild } from '@angular/core';
import { BaseForm3 } from 'app/shared/models/reports/base-form-3';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { SharedSummaryTemplatesComponent } from './shared-summary-templates.component';

export interface LineSummary {
  lineNumber: string;
  description: string;
  thisPeriod?: number;
  yearToDate?: number;
  bold?: boolean;
  italic?: boolean;
  overlay?: string;
  indent?: number;
}

@Directive()
export abstract class BaseSummaryComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);

  readonly sharedTemplate = viewChild.required(SharedSummaryTemplatesComponent);

  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly report = computed(() => this.activeReport() as BaseForm3);
  readonly isF3X = computed(() => this.router.url.includes('/f3x/'));
  readonly formText = computed(() => (this.isF3X() ? 'f3x' : 'f3'));

  readonly calculationFinished = computed(() => this.report().calculation_status === 'SUCCEEDED');

  readonly first = signal(0);
  readonly columns = computed(() => {
    const columns = [
      { field: 'lineNumber', header: 'Line', cssClass: 'line-column' },
      {
        field: 'description',
        header: 'Description',
        cssClass: 'description-column',
        bodyTpl: this.sharedTemplate().descriptionTpl(),
      },
      { field: 'thisPeriod', header: 'This Period', cssClass: 'period-column', pipes: ['currency'] },
      {
        field: 'yearToDate',
        header: this.isF3X() ? 'Calendar Year-to-Date' : 'Election Cycle-to-Date',
        cssClass: 'ytd-column',
        pipes: ['currency'],
      },
    ];

    return columns;
  });

  constructor() {
    effect(async () => {
      const report = this.report();
      if (!report.calculation_status) {
        await this.apiService.post(`/web-services/summary/calculate-summary/`, { report_id: report.id });
        this.refreshSummary();
      } else if (report.calculation_status != 'SUCCEEDED') {
        this.refreshSummary();
      }
    });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report().id);
  }
}
