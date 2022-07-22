import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { Report } from '../../../shared/interfaces/report.interface';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { f3xReportCodeDetailedLabels, LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';

@Component({
  selector: 'app-menu-report',
  templateUrl: './menu-report.component.html',
  styleUrls: ['./menu-report.component.scss'],
})
export class MenuReportComponent implements OnInit {
  activeReport: Report | null = null;
  currentReportId: number | null = null;
  items: MenuItem[] = [];
  displayMenu = false;
  urlMatch: RegExp[] = [
    /^\/reports\/f3x\/create\/step3\/\d+/,
    /^\/transactions\/report\/\d+\/create/,
    /^\/reports\/f3x\/summary\/\d+/,
    /^\/reports\/f3x\/detailed-summary\/\d+/,
    /^\/reports\/f3x\/submit\/step1\/\d+/,
  ];
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);

    this.store.select(selectActiveReport).subscribe((report: Report | null) => {
      this.activeReport = report;
    });

    // Watch the router changes and display menu if URL is in urlMatch list.
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.displayMenu = this.isActive(this.urlMatch, event.url);

        if (this.displayMenu && this.activeReport && this.activeReport.id !== this.currentReportId) {
          this.currentReportId = this.activeReport.id;

          this.items = [
            {
              label: 'ENTER A TRANSACTION',
              expanded: this.isActive(this.urlMatch.slice(0, 1), event.url),
              items: [
                {
                  label: 'Manage your transactions',
                  routerLink: [`/reports/f3x/create/step3/${this.currentReportId}`],
                },
                {
                  label: 'Add a receipt',
                  routerLink: [`/transactions/report/${this.currentReportId}/create`],
                },
                { label: 'Add a disbursements', styleClass: 'menu-item-disabled' },
                { label: 'Add loans and debts', styleClass: 'menu-item-disabled' },
                { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
              ],
            },
            {
              label: 'REVIEW A REPORT',
              expanded: this.isActive(this.urlMatch.slice(2, 3), event.url),
              items: [
                {
                  label: 'View summary page',
                  routerLink: [`/reports/f3x/summary/${this.currentReportId}`],
                },
                {
                  label: 'View detailed summary page',
                  routerLink: [`/reports/f3x/detailed-summary/${this.currentReportId}`],
                },
                { label: 'View print preview' },
                { label: 'Add a report level memo' },
              ],
            },
            {
              label: 'SUBMIT YOUR REPORT',
              expanded: this.isActive(this.urlMatch.slice(4, 5), event.url),
              items: [
                { label: 'Confirm information', routerLink: [`/reports/f3x/submit/step1/${this.currentReportId}`] },
                { label: 'Submit report' },
              ],
            },
          ];
        }
      }
    });
  }

  isActive(urlMatch: RegExp[], url: string): boolean {
    return urlMatch.reduce((prev: boolean, regex: RegExp) => prev || regex.test(url), false);
  }
}
