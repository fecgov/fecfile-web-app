import { Component, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { PanelMenu } from 'primeng/panelmenu';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { Form3 } from 'app/shared/models';

@Component({
  selector: 'app-f3-menu',
  templateUrl: './f3-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, FecDatePipe],
})
export class F3MenuComponent extends AbstractMenuComponent {
  readonly formLabel = computed(() => this.activeReport().formLabel);
  readonly subLabel = computed(() => this.activeReport().formSubLabel);
  readonly coverage_from_date = computed(() => (this.activeReport() as Form3).coverage_from_date);
  readonly coverage_through_date = computed(() => (this.activeReport() as Form3).coverage_through_date);
  protected readonly reportString = 'f3';

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const transactionItems = [
      {
        label: 'Manage your transactions',
        routerLink: `/reports/transactions/report/${this.activeReport().id}/list`,
      },
      {
        label: 'Add a receipt',
        routerLink: `/reports/transactions/report/${this.activeReport().id}/select/receipt`,
      },
      {
        label: 'Add a disbursement',
        routerLink: `/reports/transactions/report/${this.activeReport().id}/select/disbursement`,
      },
      {
        label: 'Add loans and debts',
        routerLink: `/reports/transactions/report/${this.activeReport().id}/select/loans-and-debts`,
      },
      { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
    ];
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [
      {
        label: 'View summary page',
        routerLink: `/reports/f3/summary/${this.activeReport().id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/f3/detailed-summary/${this.activeReport().id}`,
      },
      this.printPreview(),
      {
        label: 'Add a report level memo',
        routerLink: `/reports/f3/memo/${this.activeReport().id}`,
        visible: isEditable,
      },
    ];
    return [
      this.enterTransaction(sidebarState, isEditable, transactionItems),
      this.reviewTransactions(sidebarState, isEditable),
      reviewReport,
      {
        label: 'SUBMIT YOUR REPORT',
        expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
        items: this.submitReportArray(isEditable),
      },
    ];
  }
}
