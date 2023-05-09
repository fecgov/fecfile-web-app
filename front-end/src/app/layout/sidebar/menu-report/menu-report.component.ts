import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Observable, of, Subject, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../store/active-report.selectors';
import { selectCashOnHand } from '../../../store/cash-on-hand.selectors';
import { Report, CashOnHand } from '../../../shared/interfaces/report.interface';
import { LabelList } from '../../../shared/utils/label.utils';
import { F3xFormTypeLabels } from '../../../shared/models/f3x-summary.model';
import { ReportService } from '../../../shared/services/report.service';
import { ReportSidebarState, SidebarState } from '../sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

@Component({
  selector: 'app-menu-report',
  templateUrl: './menu-report.component.html',
  styleUrls: ['./menu-report.component.scss'],
})
export class MenuReportComponent implements OnInit, OnDestroy {
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  private destroy$ = new Subject<boolean>();

  constructor(private store: Store, private reportService: ReportService) {}

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.items$ = combineLatest([
      this.store.select(selectCashOnHand),
      this.store.select(selectSidebarState),
      this.activeReport$,
    ]).pipe(
      takeUntil(this.destroy$),
      switchMap(([cashOnHand, sidebarState, activeReport]: [CashOnHand, SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);
        return of([
          {
            label: 'ENTER A TRANSACTION',
            expanded: sidebarState?.section == ReportSidebarState.TRANSACTIONS,
            visible: isEditable,
            items: [
              {
                label: 'Cash on hand',
                routerLink: [`/reports/f3x/create/cash-on-hand/${activeReport?.id}`],
                visible: activeReport?.id === cashOnHand.report_id,
              },
              {
                label: 'Manage your transactions',
                routerLink: [`/transactions/report/${activeReport?.id}/list`],
              },
              {
                label: 'Add a receipt',
                routerLink: [`/transactions/report/${activeReport?.id}/select/receipt`],
                visible: isEditable,
              },
              {
                label: 'Add a disbursement',
                routerLink: [`/transactions/report/${activeReport?.id}/select/disbursement`],
                visible: isEditable,
              },
              { label: 'Add loans and debts', styleClass: 'menu-item-disabled' },
              { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
            ],
          },
          {
            label: 'REVIEW A REPORT',
            expanded: sidebarState?.section == ReportSidebarState.REVIEW,
            items: [
              {
                label: 'View summary page',
                routerLink: [`/reports/f3x/summary/${activeReport?.id}`],
              },
              {
                label: 'View detailed summary page',
                routerLink: [`/reports/f3x/detailed-summary/${activeReport?.id}`],
              },
              {
                label: 'View print preview',
                routerLink: [`/reports/f3x/web-print/${activeReport?.id}`],
              },
              {
                label: 'Add a report level memo',
                routerLink: [`/reports/f3x/memo/${activeReport?.id}`],
                visible: isEditable,
              },
            ],
          },
          {
            label: 'SUBMIT YOUR REPORT',
            expanded: sidebarState?.section == ReportSidebarState.SUBMISSION,
            items: [
              {
                label: 'Confirm information',
                routerLink: [`/reports/f3x/submit/step1/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Submit report',
                routerLink: [`/reports/f3x/submit/step2/${activeReport?.id}`],
                visible: isEditable,
              },
              {
                label: 'Report status',
                routerLink: [`/reports/f3x/submit/status/${activeReport?.id}`],
              },
            ],
          },
        ] as MenuItem[]);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
