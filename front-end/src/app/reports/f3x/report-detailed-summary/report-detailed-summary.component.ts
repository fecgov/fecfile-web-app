import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, delay, of, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { Destroyer } from 'app/shared/components/app-destroyer.component';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportDetailedSummaryComponent extends Destroyer implements OnInit {
  protected calculationFinished$ = new BehaviorSubject<boolean>(false);
  report: F3xSummary = new F3xSummary();

  constructor(
    private store: Store,
    public router: Router,
    private apiService: ApiService,
    private reportService: ReportService
  ) {
    super();
  }

  ngOnInit(): void {
    this.calculationFinished$.pipe(takeUntil(this.destroy$)).subscribe();

    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.report = report as F3xSummary;
        if (!report.calculation_status) {
          this.apiService
            .post(`/web-services/summary/calculate-summary/`, { report_id: report.id })
            .subscribe(() => this.refreshSummary());
        } else if (report.calculation_status != 'SUCCEEDED') {
          of(true)
            .pipe(delay(1000), takeUntil(this.destroy$))
            .subscribe(() => this.refreshSummary());
        } else {
          this.calculationFinished$.next(true);
        }
      });
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report.id).subscribe();
  }
}
