import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import { Report, CashOnHand } from '../../../shared/interfaces/report.interface';
import { ReportCodeLabelList } from '../../../shared/utils/reportCodeLabels.utils';
import { f3xReportCodeDetailedLabels, LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';

@Component({
  selector: 'app-menu-report',
  templateUrl: './menu-report.component.html',
  styleUrls: ['./menu-report.component.scss'],
})
export class MenuReportComponent implements OnInit, OnDestroy {
  activeReport: Report | null = null;
  currentReportId: number | null = null;
  items: MenuItem[] = [];
  showMenu = false;
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xReportCodeDetailedLabels: LabelList = f3xReportCodeDetailedLabels;
  cashOnHand: CashOnHand = {
    report_id: null,
    value: null,
  };

  private destroy$ = new Subject<boolean>();

  // The order of the url regular expressions listed inthe urlMatch array is important
  // because the order determines the expanded menu item group in the panal menu:
  // 'Enter A Transaction', 'Review A Report', and 'Submit Your Report'.
  urlMatch: RegExp[] = [
    /^\/reports\/f3x\/create\/cash-on-hand\/\d+/, // Enter a transaction group
    /^\/transactions\/report\/\d+\/list/, // Enter a transaction group
    /^\/transactions\/report\/\d+\/create/, // Enter a transaction group
    /^\/reports\/f3x\/summary\/\d+/, // Review a report group
    /^\/reports\/f3x\/detailed-summary\/\d+/, // Review a report group
    /^\/reports\/f3x\/web-print\/\d+/, // Review a report group
    /^\/reports\/f3x\/memo\/\d+/, // Review a report group
    /^\/reports\/f3x\/submit\/step1\/\d+/, // Submit your report group
    /^\/reports\/f3x\/submit\/step2\/\d+/, // Submit your report group
    /^\/reports\/f3x\/submit\/status\/\d+/, // Submit your report group
  ];

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);

    // Update the active report whenever a new one is pushed to the ngrx store.
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report: Report | null) => {
        this.activeReport = report;
      });

    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand: CashOnHand) => {
        this.cashOnHand = cashOnHand;
      });

    // Watch the router changes and display menu if URL is in urlMatch list.
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEvent(event);
      }
    });
  }

  handleNavigationEvent(event: NavigationEnd) {
    // Show the sidebar report menu if the router url matches one of the url
    // regular expressions in the matchUrl array.
    this.showMenu = this.isActive(this.urlMatch, event.url);

    if (this.showMenu && this.activeReport) {
      if (this.activeReport.id !== this.currentReportId) {
        this.currentReportId = this.activeReport.id;

        this.items = [
          {
            label: 'ENTER A TRANSACTION',
            expanded: false,
            items: [
              {
                label: 'Cash on hand',
                routerLink: [`/reports/f3x/create/cash-on-hand/${this.currentReportId}`],
                visible: this.currentReportId === this.cashOnHand.report_id,
              },
              {
                label: 'Manage your transactions',
                routerLink: [`/transactions/report/${this.currentReportId}/list`],
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
            expanded: false,
            items: [
              {
                label: 'View summary page',
                routerLink: [`/reports/f3x/summary/${this.currentReportId}`],
              },
              {
                label: 'View detailed summary page',
                routerLink: [`/reports/f3x/detailed-summary/${this.currentReportId}`],
              },
              {
                label: 'View print preview',
                routerLink: [`/reports/f3x/web-print/${this.currentReportId}`],
              },
              { label: 'Add a report level memo', routerLink: [`/reports/f3x/memo/${this.currentReportId}`] },
            ],
          },
          {
            label: 'SUBMIT YOUR REPORT',
            expanded: false,
            items: [
              { label: 'Confirm information', routerLink: [`/reports/f3x/submit/step1/${this.currentReportId}`] },
              { label: 'Submit report', routerLink: [`/reports/f3x/submit/step2/${this.currentReportId}`] },
              { label: 'Report status', routerLink: [`/reports/f3x/submit/status/${this.currentReportId}`] },
            ],
          },
        ];
      }

      // Slice indexes are determined by the number of entries in each urlMatch group
      this.items[0].expanded = this.isActive(this.urlMatch.slice(0, 3), event.url);
      this.items[1].expanded = this.isActive(this.urlMatch.slice(3, 7), event.url);
      this.items[2].expanded = this.isActive(this.urlMatch.slice(7, 10), event.url);
    }
  }

  /**
   * Determine if the given url matches one of the regular expressions that define which
   * group of menu items is selected.
   *
   * @param urlMatch {RegExp{}} - List of url regular expressions to compare to current router url
   * @param url {string} - Current url in browser address bar
   * @returns {boolean} - True is url matches one of the matchUrl regular expressions
   */
  isActive(urlMatch: RegExp[], url: string): boolean {
    return urlMatch.reduce((prev: boolean, regex: RegExp) => prev || regex.test(url), false);
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
