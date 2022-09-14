import { Component, OnInit, OnDestroy } from '@angular/core';
import { BehaviorSubject, delay, Observable, of, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { ApiService } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';

@Component({
  selector: 'app-report-detailed-summary',
  templateUrl: './report-detailed-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportDetailedSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  protected calculationFinished$ = new BehaviorSubject<boolean>(false);
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();

  constructor(
    private store: Store,
    public router: Router,
    private apiService: ApiService,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store
      .select<ReportCodeLabelList>(selectReportCodeLabelList)
      .pipe(takeUntil(this.destroy$));

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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  refreshSummary(): void {
    this.reportService.setActiveReportById(this.report.id).subscribe();
  }
}
