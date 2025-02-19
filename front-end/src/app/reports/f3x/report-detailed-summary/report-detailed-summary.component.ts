import { Component, inject, OnInit } from '@angular/core';
import { BehaviorSubject, delay, of, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Card } from 'primeng/card';
import { AsyncPipe, CurrencyPipe } from '@angular/common';
import { CalculationOverlayComponent } from '../../../shared/components/calculation-overlay/calculation-overlay.component';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { DefaultZeroPipe } from '../../../shared/pipes/default-zero.pipe';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss'],
  imports: [Card, CalculationOverlayComponent, ButtonDirective, Ripple, AsyncPipe, CurrencyPipe, DefaultZeroPipe],
})
export class ReportDetailedSummaryComponent extends DestroyerComponent implements OnInit {
  private readonly store = inject(Store);
  public readonly router = inject(Router);
  private readonly apiService = inject(ApiService);
  private readonly reportService = inject(ReportService);
  protected readonly calculationFinished$ = new BehaviorSubject<boolean>(false);
  report: Form3X = new Form3X();

  ngOnInit(): void {
    this.calculationFinished$.pipe(takeUntil(this.destroy$)).subscribe();

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as Form3X;
        if (!(report as Form3X).calculation_status) {
          this.apiService
            .post(`/web-services/summary/calculate-summary/`, { report_id: report.id })
            .then(() => this.refreshSummary());
        } else if ((report as Form3X).calculation_status != 'SUCCEEDED') {
          of(true)
            .pipe(delay(1000), takeUntil(this.destroy$))
            .subscribe(() => this.refreshSummary());
        } else {
          this.calculationFinished$.next(true);
        }
      });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report.id);
  }
}
