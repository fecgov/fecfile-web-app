import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable, of, switchMap, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { selectActiveReport } from '../../../../store/active-report.selectors';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { DestroyerComponent } from 'app/shared/components/app-destroyer.component';
import { Form3X } from '../../../../shared/models/form-3x.model';
import { F3xReportCodes } from 'app/shared/utils/report-code.utils';

@Component({
  selector: 'app-f3x-menu',
  templateUrl: './f3x-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F3XMenuComponent extends DestroyerComponent implements OnInit {
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  formLabel?: string;
  report_code?: F3xReportCodes;
  coverage_from_date?: Date;
  coverage_through_date?: Date;

  constructor(private store: Store, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.activeReport$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      this.formLabel = report?.formLabel;
      this.report_code = (report as Form3X).report_code;
      this.coverage_from_date = (report as Form3X).coverage_from_date;
      this.coverage_through_date = (report as Form3X).coverage_through_date;
    });

    this.items$ = combineLatest([this.store.select(selectSidebarState), this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      switchMap(([sidebarState, activeReport]: [SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);

        let transactionItems = [
          {
            label: 'Manage your transactions',
            routerLink: `/reports/transactions/report/${activeReport?.id}/list`,
          },
          {
            label: 'Add a receipt',
            routerLink: `/reports/transactions/report/${activeReport?.id}/select/receipt`,
          },
          {
            label: 'Add a disbursement',
            routerLink: `/reports/transactions/report/${activeReport?.id}/select/disbursement`,
          },
          {
            label: 'Add loans and debts',
            routerLink: `/reports/transactions/report/${activeReport?.id}/select/loans-and-debts`,
          },
          { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
        ];
        if (activeReport?.is_first) {
          transactionItems = [
            {
              label: 'Cash on hand',
              routerLink: `/reports/f3x/create/cash-on-hand/${activeReport?.id}`,
            },
            ...transactionItems,
          ];
        }

        return of([
          {
            label: 'ENTER A TRANSACTION',
            expanded: sidebarState?.section == ReportSidebarSection.TRANSACTIONS,
            visible: isEditable,
            items: transactionItems,
          },
          {
            label: 'REVIEW TRANSACTIONS',
            expanded: sidebarState?.section == ReportSidebarSection.TRANSACTIONS,
            visible: !isEditable,
            routerLink: `/reports/transactions/report/${activeReport?.id}/list`,
          },
          {
            label: 'REVIEW A REPORT',
            expanded: sidebarState?.section == ReportSidebarSection.REVIEW,
            items: [
              {
                label: 'View summary page',
                routerLink: `/reports/f3x/summary/${activeReport?.id}`,
              },
              {
                label: 'View detailed summary page',
                routerLink: `/reports/f3x/detailed-summary/${activeReport?.id}`,
              },
              {
                label: 'View print preview',
                routerLink: `/reports/f3x/web-print/${activeReport?.id}`,
              },
              {
                label: 'Add a report level memo',
                routerLink: `/reports/f3x/memo/${activeReport?.id}`,
                visible: isEditable,
              },
            ],
          },
          {
            label: 'SUBMIT YOUR REPORT',
            expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
            items: [
              {
                label: 'Confirm information',
                routerLink: `/reports/f3x/submit/step1/${activeReport?.id}`,
                visible: isEditable,
              },
              {
                label: 'Submit report',
                routerLink: `/reports/f3x/submit/step2/${activeReport?.id}`,
                visible: isEditable,
              },
              {
                label: 'Report status',
                routerLink: `/reports/f3x/submit/status/${activeReport?.id}`,
              },
            ],
          },
        ] as MenuItem[]);
      })
    );
  }
}
