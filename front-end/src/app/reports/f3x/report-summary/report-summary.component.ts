import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { f3xReportCodeDetailedLabels, LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary = new F3xSummary();
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  constructor(private store: Store, public router: Router) {}

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as F3xSummary));
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
