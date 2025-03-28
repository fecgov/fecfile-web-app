import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { takeUntil } from 'rxjs';
import { Form3 } from '../../../../shared/models/form-3.model';
import { AsyncPipe } from '@angular/common';
import { PanelMenu } from 'primeng/panelmenu';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';

@Component({
  selector: 'app-f3-menu',
  templateUrl: './f3-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, AsyncPipe, FecDatePipe],
})
export class F3MenuComponent extends AbstractMenuComponent implements OnInit {
  formLabel?: string;
  subLabel?: string;
  coverage_from_date?: Date;
  coverage_through_date?: Date;
  override reportString = 'f3';

  override ngOnInit() {
    super.ngOnInit();
    if (!this.activeReport$) return;
    this.activeReport$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      this.formLabel = report?.formLabel;
      this.subLabel = report?.formSubLabel;
      this.coverage_from_date = (report as Form3).coverage_from_date;
      this.coverage_through_date = (report as Form3).coverage_through_date;
    });
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
    const transactionItems = [
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
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [
      {
        label: 'View summary page',
        routerLink: `/reports/f3/summary/${activeReport?.id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/f3/detailed-summary/${activeReport?.id}`,
      },
      this.printPreview(activeReport),
      {
        label: 'Add a report level memo',
        routerLink: `/reports/f3/memo/${activeReport?.id}`,
        visible: isEditable,
      },
    ];
    return [
      this.enterTransaction(sidebarState, isEditable, transactionItems),
      this.reviewTransactions(sidebarState, activeReport, isEditable),
      reviewReport,
      {
        label: 'SUBMIT YOUR REPORT',
        expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
        items: this.submitReportArray(activeReport, isEditable),
      },
    ];
  }
}
