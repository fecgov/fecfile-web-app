import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MenuItem } from 'primeng/api';
import { Report } from '../../../../shared/models/report.model';
import { ReportService } from '../../../../shared/services/report.service';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { takeUntil } from 'rxjs';
import { Form3X } from '../../../../shared/models/form-3x.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-f3x-menu',
  templateUrl: './f3x-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
})
export class F3XMenuComponent extends AbstractMenuComponent implements OnInit {
  formLabel?: string;
  subLabel?: string;
  coverage_from_date?: Date;
  coverage_through_date?: Date;

  constructor(store: Store, reportService: ReportService, router: Router) {
    super(store, reportService, router);
    this.reportString = 'f3x';
  }

  override ngOnInit() {
    super.ngOnInit();
    if (!this.activeReport$) return;
    this.activeReport$.pipe(takeUntil(this.destroy$)).subscribe((report) => {
      this.formLabel = report?.formLabel;
      this.subLabel = report?.formSubLabel;
      this.coverage_from_date = (report as Form3X).coverage_from_date;
      this.coverage_through_date = (report as Form3X).coverage_through_date;
    });
  }

  getMenuItems(sidebarState: SidebarState, activeReport: Report | undefined, isEditable: boolean): MenuItem[] {
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
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [
      {
        label: 'View summary page',
        routerLink: `/reports/f3x/summary/${activeReport?.id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/f3x/detailed-summary/${activeReport?.id}`,
      },
      this.printPreview(activeReport),
      {
        label: 'Add a report level memo',
        routerLink: `/reports/f3x/memo/${activeReport?.id}`,
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
