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

@Component({
  selector: 'app-f24-menu',
  templateUrl: './f24-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F24MenuComponent extends DestroyerComponent implements OnInit {
  activeReport$?: Observable<Report | undefined>;
  items$: Observable<MenuItem[]> = of([]);

  formLabel?: string;

  constructor(private store: Store, private reportService: ReportService) {
    super();
  }

  ngOnInit(): void {
    this.activeReport$ = this.store.select(selectActiveReport);

    this.activeReport$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      this.formLabel = report?.formLabel;
    });

    this.items$ = combineLatest([this.store.select(selectSidebarState), this.activeReport$]).pipe(
      takeUntil(this.destroy$),
      switchMap(([sidebarState, activeReport]: [SidebarState, Report | undefined]) => {
        const isEditable = this.reportService.isEditable(activeReport);

        const transactionItems = [
          {
            label: 'Manage your transactions',
            routerLink: `/reports/transactions/report/${activeReport?.id}/list`,
          },
          {
            label: 'Add a disbursement',
            routerLink: `/reports/transactions/report/${activeReport?.id}/select/disbursement`,
          },
        ];

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
                routerLink: `/reports/f24/summary/${activeReport?.id}`,
                disabled: true,
              },
              {
                label: 'View detailed summary page',
                routerLink: `/reports/f24/detailed-summary/${activeReport?.id}`,
                disabled: true,
              },
              {
                label: 'View print preview',
                routerLink: `/reports/f24/web-print/${activeReport?.id}`,
              },
              {
                label: 'Add a report level memo',
                routerLink: `/reports/f24/memo/${activeReport?.id}`,
                visible: isEditable,
              },
            ],
          },
          {
            label: 'SIGN & SUBMIT',
            expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
            items: [
              {
                label: 'Confirm information',
                routerLink: `/reports/f24/submit/step1/${activeReport?.id}`,
                visible: isEditable,
              },
              {
                label: 'Submit report',
                routerLink: `/reports/f24/submit/step2/${activeReport?.id}`,
                visible: isEditable,
              },
              {
                label: 'Report status',
                routerLink: `/reports/f24/submit/status/${activeReport?.id}`,
                visible: !isEditable,
              },
            ],
          },
        ] as MenuItem[]);
      })
    );
  }
}
