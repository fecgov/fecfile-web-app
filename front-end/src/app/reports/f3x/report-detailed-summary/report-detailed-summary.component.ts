import { Component, computed, effect, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/reports/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { Card } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';
import { CalculationOverlayComponent } from '../../../shared/components/calculation-overlay/calculation-overlay.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DefaultZeroPipe } from '../../../shared/pipes/default-zero.pipe';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss', './report-detailed-summary.component.scss'],
  imports: [Card, CalculationOverlayComponent, ButtonDirective, Ripple, CurrencyPipe, DefaultZeroPipe],
})
export class ReportDetailedSummaryComponent {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);
  readonly activeReport = this.store.selectSignal(selectActiveReport);
  readonly report = computed(() => this.activeReport() as Form3X);
  readonly calculationFinished = computed(() => this.report().calculation_status === 'SUCCEEDED');
  private readonly lastUpdatedByReportId = new Map<string, number>();
  private static readonly lastCalcByReportId = new Map<string, number>();
  private readonly refreshedReportIds = new Set<string>();


  constructor() {
    effect(async () => {
      const report = this.report();
      const reportId = report?.id;
      if (!reportId) return;

      const updatedAt = report.updated?.getTime();
      const lastCalcAt = ReportDetailedSummaryComponent.lastCalcByReportId.get(reportId);
      const shouldRecalc = updatedAt !== undefined && updatedAt !== lastCalcAt;
      if (!report.calculation_status || shouldRecalc) {
        await this.apiService.post(`/web-services/summary/calculate-summary/`, { report_id: reportId });
        if (updatedAt !== undefined) {
          ReportDetailedSummaryComponent.lastCalcByReportId.set(reportId, updatedAt);
        }
        this.refreshSummary();
      } else if (report.calculation_status !== 'SUCCEEDED') {
        this.refreshSummary();
        return;
      } else if (!this.refreshedReportIds.has(reportId)) {
        this.refreshSummary();
      }
    });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report().id);
  }
}
