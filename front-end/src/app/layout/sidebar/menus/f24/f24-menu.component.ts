import { Component, computed, effect, signal } from '@angular/core';
import { RenameF24DialogComponent } from 'app/reports/f24/rename-f24-dialog/rename-f24-dialog.component';
import { Form24 } from 'app/shared/models';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';

@Component({
  selector: 'app-f24-menu',
  templateUrl: './f24-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, RenameF24DialogComponent],
})
export class F24MenuComponent extends AbstractMenuComponent {
  override readonly reportString = 'f24';
  readonly formLabelSignal = computed(() => this.activeReport().formLabel);
  readonly subLabelSignal = computed(() => this.activeReport().formSubLabel);
  form24ToUpdate?: Form24;
  readonly renameF24DialogVisible = signal(false);

  constructor() {
    super();
    effect(() => {
      if (this.renameF24DialogVisible() === false && this.form24ToUpdate) {
        this.form24ToUpdate = undefined;
        this.reportService.setActiveReportById(this.activeReport().id);
      }
    });
  }

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const transactionItems = [
      {
        label: 'Manage your transactions',
        routerLink: `/reports/transactions/report/${this.activeReport().id}/list`,
      },
      {
        label: 'Add an independent expenditure',
        routerLink: `/reports/f24/report/${this.activeReport().id}/transactions/select/independent-expenditures`,
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

  public renameForm24(): void {
    this.form24ToUpdate = this.activeReport() as Form24;
    this.renameF24DialogVisible.set(true);
  }
}
