import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { f3xReportCodeDetailedLabels, LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';

@Component({
  selector: 'app-report-summary',
  templateUrl: './submit-f3x-status.component.html',
})
export class ReportSubmissionStatusComponent implements OnInit {
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  constructor(private store: Store, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];
  }

  public backToReports() {
    this.router.navigateByUrl('/reports');
  }
}
