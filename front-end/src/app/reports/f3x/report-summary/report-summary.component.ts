import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../styles.scss'],
})
export class ReportSummaryComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();

  constructor(private store: Store, public router: Router) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store
      .select<ReportCodeLabelList>(selectReportCodeLabelList)
      .pipe(takeUntil(this.destroy$));

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
