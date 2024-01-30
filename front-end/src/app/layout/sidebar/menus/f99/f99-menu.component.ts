import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';

@Component({
  selector: 'app-f99-menu',
  templateUrl: './f99-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F99MenuComponent extends AbstractMenuComponent implements OnInit {
  constructor(store: Store, reportService: ReportService) {
    super(store, reportService);
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    return [
      {
        label: 'CREATE A REPORT',
        expanded: sidebarState?.section == ReportSidebarSection.CREATE,
        items: [
          {
            label: 'Edit your report',
            routerLink: [`/reports/f99/edit/${activeReport?.id}`],
          },
        ],
      },
      {
        label: 'REVIEW A REPORT',
        expanded: sidebarState?.section == ReportSidebarSection.REVIEW,
        items: [
          // {
          //   label: 'View summary page',
          //   routerLink: [`/reports/f99/summary/${activeReport?.id}`],
          // },
          // {
          //   label: 'View detailed summary page',
          //   routerLink: [`/reports/f99/detailed-summary/${activeReport?.id}`],
          // },
          {
            label: 'View print preview',
            routerLink: [`/reports/f99/web-print/${activeReport?.id}`],
          },
          // {
          //   label: 'Add a report level memo',
          //   routerLink: [`/reports/f99/memo/${activeReport?.id}`],
          //   visible: isEditable,
          // },
        ],
      },
      {
        label: 'SIGN & SUBMIT',
        expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
        items: [
          {
            label: 'Confirm information',
            routerLink: [`/reports/f99/submit/step1/${activeReport?.id}`],
            visible: isEditable,
          },
          {
            label: 'Submit report',
            routerLink: [`/reports/f99/submit/step2/${activeReport?.id}`],
            visible: isEditable,
          },
          {
            label: 'Report status',
            routerLink: [`/reports/f99/submit/status/${activeReport?.id}`],
          },
        ],
      },
    ] as MenuItem[];
  }
}
