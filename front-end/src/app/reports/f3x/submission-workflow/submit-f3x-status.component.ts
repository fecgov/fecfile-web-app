import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { getReportCodeLabel } from 'app/shared/utils/report-code.utils';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-f3x-status.component.html',
})
export class ReportSubmissionStatusComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary = new F3xSummary();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  getReportCodeLabel = getReportCodeLabel;

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

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
