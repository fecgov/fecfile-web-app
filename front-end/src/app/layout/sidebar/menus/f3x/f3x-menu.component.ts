import { Component, computed } from '@angular/core';
import { ReportStatus } from 'app/shared/models';
import { MenuItem } from 'primeng/api';
import { PanelMenu } from 'primeng/panelmenu';
import { Form3X } from '../../../../shared/models/form-3x.model';
import { FecDatePipe } from '../../../../shared/pipes/fec-date.pipe';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { AbstractMenuComponent } from '../abstract-menu.component';

@Component({
  selector: 'app-f3x-menu',
  templateUrl: './f3x-menu.component.html',
  styleUrls: ['../menu-report.component.scss'],
  imports: [PanelMenu, FecDatePipe],
})
export class F3XMenuComponent extends AbstractMenuComponent {
  readonly formLabelSignal = computed(() => this.activeReportSignal().formLabel);
  readonly subLabelSignal = computed(() => this.activeReportSignal().formSubLabel);
  readonly coverageFromDateSignal = computed(() => (this.activeReportSignal() as Form3X).coverage_from_date);
  readonly coverageThroughDateSignal = computed(() => (this.activeReportSignal() as Form3X).coverage_through_date);
  readonly reportStatusSignal = computed(() => this.activeReportSignal().report_status);
  override readonly reportString = 'f3x';

  getMenuItems(sidebarState: SidebarState, isEditable: boolean): MenuItem[] {
    const transactionItems = [
      {
        label: 'Manage your transactions',
        routerLink: `/reports/transactions/report/${this.activeReportSignal().id}/list`,
      },
      {
        label: 'Add a receipt',
        routerLink: `/reports/transactions/report/${this.activeReportSignal().id}/select/receipt`,
      },
      {
        label: 'Add a disbursement',
        routerLink: `/reports/transactions/report/${this.activeReportSignal().id}/select/disbursement`,
      },
      {
        label: 'Add loans and debts',
        routerLink: `/reports/transactions/report/${this.activeReportSignal().id}/select/loans-and-debts`,
      },
      { label: 'Add other transactions', styleClass: 'menu-item-disabled' },
    ];
    const reviewReport = this.reviewReport(sidebarState);
    reviewReport.items = [
      {
        label: 'View summary page',
        routerLink: `/reports/f3x/summary/${this.activeReportSignal().id}`,
      },
      {
        label: 'View detailed summary page',
        routerLink: `/reports/f3x/detailed-summary/${this.activeReportSignal().id}`,
      },
      this.printPreview(),
      {
        label: 'Add a report level memo',
        routerLink: `/reports/f3x/memo/${this.activeReportSignal().id}`,
        visible: isEditable,
      },
    ];
    const editReportIsVisible =
      this.reportStatusSignal() === ReportStatus.IN_PROGRESS ||
      this.reportStatusSignal() === ReportStatus.SUBMIT_FAILURE;
    const editReportLabel = 'EDIT REPORT DETAILS';
    const editReportLabelStyleClass = '';
    return [
      ...(editReportIsVisible
        ? [this.editReport(sidebarState, editReportIsVisible, editReportLabel, editReportLabelStyleClass)]
        : []),
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
