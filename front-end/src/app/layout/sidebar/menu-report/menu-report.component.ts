import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event, ActivationStart } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import { Report, CashOnHand } from '../../../shared/interfaces/report.interface';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { ReportService } from '../../../shared/services/report.service';
import { ReportSidebarState } from '../sidebar.component';

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
  sidebarState: ReportSidebarState | undefined;

  private destroy$ = new Subject<boolean>();

  constructor(private router: Router, private store: Store, private reportService: ReportService) {}

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

    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEvent(event);
      }
      if (event instanceof ActivationStart) {
        const data = event.snapshot.data;
        this.sidebarState = data?.['sidebar']?.['sidebarState'];
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

      this.items[0].expanded = this.sidebarState == ReportSidebarState.TRANSACTIONS;
      this.items[1].expanded = this.sidebarState == ReportSidebarState.REVIEW;
      this.items[2].expanded = this.sidebarState == ReportSidebarState.SUBMISSION;

      // This fixes a bug where the sidebarState is undefined when first navigating to a report
      if (this.sidebarState == undefined) this.items[0].expanded = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
