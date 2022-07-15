import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';

@Component({
  selector: 'app-report-summary',
  templateUrl: './report-summary.component.html',
  styleUrls: ['../../style.scss'],
})
export class ReportSummaryComponent implements OnInit {
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();

  constructor(private store: Store, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];
  }
}
