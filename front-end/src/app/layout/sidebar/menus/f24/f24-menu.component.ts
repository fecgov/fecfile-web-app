import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';

@Component({
  selector: 'app-f24-menu',
  templateUrl: './f24-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F24MenuComponent extends AbstractMenuComponent implements OnInit {
  formLabel?: string;

  constructor(store: Store, reportService: ReportService) {
    super(store, reportService);
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    const transactionItems = [
      {
        label: 'Manage your transactions',
        routerLink: `/reports/transactions/report/${activeReport?.id}/list`,
      },
      {
        label: 'Add an independent expenditure',
        routerLink: `/reports/f24/report/${activeReport?.id}/transactions/select/independent-expenditures`,
      },
    ];
    return [
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
    ] as MenuItem[];
  }
}
