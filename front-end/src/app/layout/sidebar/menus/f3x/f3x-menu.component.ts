import { Component, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { Form3X } from '../../../../shared/models/form-3x.model';
import { PanelMenu } from 'primeng/panelmenu';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';

@Component({
  selector: 'app-f3x-menu',
  templateUrl: './f3x-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, FecDatePipe],
})
export class F3XMenuComponent extends AbstractMenuComponent {
  readonly formLabel = computed(() => this.activeReport().formLabel);
  readonly subLabel = computed(() => this.activeReport().formSubLabel);
  readonly coverage_from_date = computed(() => (this.activeReport() as Form3X).coverage_from_date);
  readonly coverage_through_date = computed(() => (this.activeReport() as Form3X).coverage_through_date);
  protected readonly reportString = 'f3x';

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
        routerLink: `/reports/f3x/summary/${this.activeReport().id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/f3x/detailed-summary/${this.activeReport().id}`,
      },
      this.printPreview(),
      {
        label: 'Add a report level memo',
        routerLink: `/reports/f3x/memo/${this.activeReport().id}`,
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
