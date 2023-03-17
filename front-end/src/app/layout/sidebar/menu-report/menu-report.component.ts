import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event, ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import { Report, CashOnHand } from '../../../shared/interfaces/report.interface';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { ReportService } from '../../../shared/services/report.service';

@Component({
  selector: 'app-menu-report',
  templateUrl: './menu-report.component.html',
  styleUrls: ['./menu-report.component.scss'],
})
export class MenuReportComponent implements OnInit, OnDestroy {
  activeReport: Report | undefined;
  currentReportId: string | undefined;
  currentReportTimestamp: number | undefined;
  expandedSection: 'Transactions' | 'Review' | 'Submission' | 'None' = 'None';
  items: MenuItem[] = [];
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  reportIsEditableFlag = false;
  cashOnHand: CashOnHand = {
    report_id: undefined,
    value: undefined,
  };

  private destroy$ = new Subject<boolean>();

  // The order of the url regular expressions listed inthe urlMatch array is important
  // because the order determines the expanded menu item group in the panal menu:
  // 'Enter A Transaction', 'Review A Report', and 'Submit Your Report'.
  urlMatch: RegExp[] = [
    /^\/reports\/f3x\/create\/cash-on-hand\/[\da-z-]+/, // Enter a transaction group
    /^\/transactions\/report\/[\da-z-]+\/list/, // Enter a transaction group
    /^\/transactions\/report\/[\da-z-]+\/select/, // Select a transaction category
    /^\/transactions\/report\/[\da-z-]+\/create/, // Enter a transaction type
    /^\/reports\/f3x\/summary\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/detailed-summary\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/web-print\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/memo\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/submit\/step1\/[\da-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/step2\/[\da-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/status\/[\da-z-]+/, // Submit your report group
  ];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private store: Store,
    private reportService: ReportService
  ) {}

  ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report: Report | undefined) => {
        this.activeReport = report;
        this.reportIsEditableFlag = this.reportService.isEditable(report);
      });

    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand: CashOnHand) => {
        this.cashOnHand = cashOnHand;
      });

    console.log(this.route.data);
    // Watch the router changes and display menu if URL is in urlMatch list.
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEvent(event);
      }
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    this.route.data.pipe(takeUntil(this.destroy$)).subscribe((data: any) => {
      console.log('sidebarStatus:', data.sidebarStatus);
    });
  }

  handleNavigationEvent(event: NavigationEnd) {
    if (this.activeReport) {
      if (
        this.activeReport.id !== this.currentReportId ||
        this.activeReport.updated?.getTime() !== this.currentReportTimestamp
      ) {
        this.currentReportId = this.activeReport.id;
        if (this.activeReport.updated) this.currentReportTimestamp = this.activeReport.updated.getTime();

        this.items = [
          {
            label: 'ENTER A TRANSACTION',
            expanded: false,
            visible: this.reportIsEditableFlag,
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
                routerLink: [`/transactions/report/${this.currentReportId}/select/receipt`],
                visible: this.reportIsEditableFlag,
              },
              {
                label: 'Add a disbursement',
                routerLink: [`/transactions/report/${this.currentReportId}/select/disbursement`],
                visible: this.reportIsEditableFlag,
              },
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
              {
                label: 'Add a report level memo',
                routerLink: [`/reports/f3x/memo/${this.currentReportId}`],
                visible: this.reportIsEditableFlag,
              },
            ],
          },
          {
            label: 'SUBMIT YOUR REPORT',
            expanded: false,
            items: [
              {
                label: 'Confirm information',
                routerLink: [`/reports/f3x/submit/step1/${this.currentReportId}`],
                visible: this.reportIsEditableFlag,
              },
              {
                label: 'Submit report',
                routerLink: [`/reports/f3x/submit/step2/${this.currentReportId}`],
                visible: this.reportIsEditableFlag,
              },
              {
                label: 'Report status',
                routerLink: [`/reports/f3x/submit/status/${this.currentReportId}`],
              },
            ],
          },
        ];
      }

      // Slice indexes are determined by the number of entries in each urlMatch group
      this.items[0].expanded = this.expandedSection == 'Transactions';
      //this.items[0].expanded = this.isActive(this.urlMatch.slice(0, 4), event.url);
      this.items[1].expanded = this.expandedSection == 'Review';
      //this.items[1].expanded = this.isActive(this.urlMatch.slice(4, 7), event.url);
      this.items[0].expanded = this.expandedSection == 'Submission';
      //this.items[2].expanded = this.isActive(this.urlMatch.slice(7, 10), event.url);
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
