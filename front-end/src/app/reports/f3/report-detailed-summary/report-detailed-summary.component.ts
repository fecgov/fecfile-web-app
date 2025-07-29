import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3 } from 'app/shared/models/form-3.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Card } from 'primeng/card';
import { CurrencyPipe } from '@angular/common';
import { CalculationOverlayComponent } from '../../../shared/components/calculation-overlay/calculation-overlay.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DefaultZeroPipe } from '../../../shared/pipes/default-zero.pipe';
import { CalculationStatus, ServerSideEventService } from 'app/shared/services/server-side-event.service';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss', './report-detailed-summary.component.scss'],
  imports: [Card, CalculationOverlayComponent, ButtonDirective, Ripple, CurrencyPipe, DefaultZeroPipe],
})
export class ReportDetailedSummaryComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);
  private readonly sseService = inject(ServerSideEventService);
  private readonly report = this.store.selectSignal(selectActiveReport);
  readonly f3 = computed(() => this.report() as Form3);
  readonly calculationFinished = signal(false);

  ngOnInit(): void {
    const report = this.f3();
    if (!report.id) return;
    if (!report.calculation_status) {
      this.startCalculation(report.id);
    } else if (report.calculation_status !== CalculationStatus.SUCCEEDED) {
      this.listenForCompletion(report.id);
    } else {
      this.calculationFinished.set(true);
    }
  }

  async startCalculation(reportId: string) {
    this.calculationFinished.set(false);
    try {
      await this.apiService.post(`/web-services/summary/calculate-summary/`, { report_id: reportId });
      this.listenForCompletion(reportId);
    } catch (err) {
      console.error('Failed to start calculation', err);
    }
  }

  listenForCompletion(reportId: string): void {
    this.calculationFinished.set(false);
    this.sseService
      .calculationNotification(reportId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (status) => {
          console.log(`Calculation finished with status: ${status}`);
          if (status === CalculationStatus.SUCCEEDED) {
            this.refreshSummary(reportId);
          }
        },
        error: (err) => console.error('SSE connection error', err),
      });
  }

  async refreshSummary(reportId: string) {
    await this.reportService.setActiveReportById(reportId);
    this.calculationFinished.set(true);
  }
}
