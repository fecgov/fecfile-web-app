import { Component, computed } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';
import { PanelMenu } from 'primeng/panelmenu';

@Component({
  selector: 'app-f24-menu',
  templateUrl: './f24-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu],
})
export class F24MenuComponent extends AbstractMenuComponent {
  override readonly reportString = 'f24';
  readonly formLabelSignal = computed(() => this.activeReportSignal().formLabel);
  readonly subLabelSignal = computed(() => this.activeReportSignal().formSubLabel);

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const transactionItems = [
      {
        label: 'Manage your transactions',
        routerLink: `/reports/transactions/report/${this.activeReportSignal().id}/list`,
      },
      {
        label: 'Add an independent expenditure',
        routerLink: `/reports/f24/report/${this.activeReportSignal().id}/transactions/select/independent-expenditures`,
      },
    ];
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [this.printPreview(), this.addReportLevelMenu(isEditable)];
    return [
      this.enterTransaction(sidebarState, isEditable, transactionItems),
      this.reviewTransactions(sidebarState, isEditable),
      reviewReport,
      {
        label: 'SIGN & SUBMIT',
        expanded: sidebarState?.section == ReportSidebarSection.SUBMISSION,
        items: this.submitReportArray(isEditable),
      },
    ] as MenuItem[];
  }
}
