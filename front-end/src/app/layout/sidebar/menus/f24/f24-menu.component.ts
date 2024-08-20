import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'app-f24-menu',
  templateUrl: './f24-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F24MenuComponent extends AbstractMenuComponent implements OnInit {
  formLabel?: string;
  subLabel?: string;

  constructor(store: Store, reportService: ReportService, router: Router) {
    super(store, reportService, router);
    this.reportString = 'f24';
  }

  override ngOnInit() {
    super.ngOnInit();
    if (!this.activeReport$) return;
    this.activeReport$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      this.formLabel = report?.formLabel;
      this.subLabel = report?.formSubLabel;
    });
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
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview(activeReport), this.addReportLevelMenu(activeReport, isEditable)];
    return [
      this.enterTransaction(sidebarState, isEditable, transactionItems),
      this.reviewTransactions(sidebarState, activeReport, isEditable),
      reviewReport,
      {
        label: 'SIGN & SUBMIT',
        expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
        items: this.submitReportArray(activeReport, isEditable),
      },
    ] as MenuItem[];
  }
}
