import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { Pipe, PipeTransform } from '@angular/core';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-submission-status.component.html',
  styleUrls: ['../../style.scss'],
})
export class ReportSubmissionStatusComponent implements OnInit {
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;

  constructor(private store: Store, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];
    console.log(typeof this.report.coverage_from_date);
  }

  public dateTransform(date: Date | null): string {
    if (date == null) return '';

    const month = date.toLocaleString('default', { month: 'long' });
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }
}
