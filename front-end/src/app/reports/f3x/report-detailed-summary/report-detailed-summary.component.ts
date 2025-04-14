import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/form-3x.model';
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
  protected readonly calculationFinished = signal(false);
  readonly form3x = computed(() => this.report() as Form3X);
  readonly report = this.store.selectSignal(selectActiveReport);

  constructor() {
    effect(() => {
      const f3x = this.form3x();
      if (!f3x) return;

      if (!f3x.calculation_status) {
        this.apiService
          .post(`/web-services/summary/calculate-summary/`, { report_id: f3x.id })
          .then(() => this.refreshSummary());
      } else if (f3x.calculation_status !== 'SUCCEEDED') {
        setTimeout(() => this.refreshSummary(), 1000);
      } else {
        this.calculationFinished.set(true);
      }
    });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.form3x().id);
  }
}
