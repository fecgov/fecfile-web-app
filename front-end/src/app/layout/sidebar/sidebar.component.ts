import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ReportCodeLabelList } from '../../shared/utils/reportCodeLabels.utils';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  report: F3xSummary = new F3xSummary();
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  items: MenuItem[] = [];

  constructor(private store: Store, private activatedRoute: ActivatedRoute, public router: Router) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.report = this.activatedRoute.snapshot.data['report'];

    console.log('===', this.report);

    this.items = [
      {
        label: 'ENTER A TRANSACTION',
        items: [
          { label: 'Manage your transactions' },
          { label: 'Add a receipt' },
          { label: 'Add a disbursements' },
          { label: 'Add loans and debts' },
          { label: 'Add other transactions' },
        ],
      },
      {
        label: 'REVIEW A REPORT',
        items: [
          { label: 'View summary page' },
          { label: 'View detailed summary page' },
          { label: 'View print preview' },
          { label: 'Add a report level memo' },
        ],
      },
      { label: 'SUBMIT YOUR REPORT', items: [{ label: 'Confirm information' }, { label: 'Submit report' }] },
    ];
  }
}
