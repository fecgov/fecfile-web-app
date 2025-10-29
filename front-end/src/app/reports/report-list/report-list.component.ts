import { Component, effect, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableActionsButtonComponent } from 'app/shared/components/table-actions-button/table-actions-button.component';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { TableComponent } from 'app/shared/components/table/table.component';
import { Form24, Form3X, Report, ReportStatus, ReportTypes } from 'app/shared/models';
import { DotFecService } from 'app/shared/services/dot-fec.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { ReportService } from 'app/shared/services/report.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { PrimeTemplate } from 'primeng/api';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { Toolbar } from 'primeng/toolbar';
import { FecDatePipe } from '../../shared/pipes/fec-date.pipe';
import { RenameF24DialogComponent } from '../f24/rename-f24-dialog/rename-f24-dialog.component';
import { FormTypeDialogComponent } from '../form-type-dialog/form-type-dialog.component';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
  imports: [
    TableComponent,
    Toolbar,
    PrimeTemplate,
    ButtonDirective,
    Ripple,
    TableActionsButtonComponent,
    FormTypeDialogComponent,
    FecDatePipe,
    RenameF24DialogComponent,
  ],
})
export class ReportListComponent extends TableListBaseComponent<Report> {
  public readonly router = inject(Router);
  protected readonly itemService = inject(ReportService);
  private readonly store = inject(Store);
  private readonly form3XService = inject(Form3XService);
  public readonly dotFecService = inject(DotFecService);

  form24ToUpdate?: Form24;
  readonly dialogVisible = signal(false);
  readonly renameF24DialogVisible = signal(false);
  readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);
  public rowActions: TableAction[] = [
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      (report: Report) => report.report_status === ReportStatus.IN_PROGRESS,
    ),
    new TableAction('Amend', this.amendReport.bind(this), (report: Report) => report.canAmend),
    new TableAction(
      'Review',
      this.editItem.bind(this),
      (report: Report) => report.report_status !== ReportStatus.IN_PROGRESS,
    ),
    new TableAction('Delete', this.confirmDelete.bind(this), (report: Report) => report.can_delete),
    new TableAction('Unamend', this.unamendReport.bind(this), (report: Report) => report.can_unamend),
    new TableAction('Download as .fec', this.download.bind(this)),
    new TableAction('Rename', this.renameForm24.bind(this), (report: Report) => report.report_type === ReportTypes.F24),
  ];

  readonly sortableHeaders: { field: string; label: string }[] = [
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Name' },
    { field: 'coverage_through_date', label: 'Coverage' },
    { field: 'report_status', label: 'Status' },
    { field: 'version_label', label: 'Version' },
    { field: 'upload_submission__created', label: 'Filed' },
  ];

  override readonly caption =
    'Data table of all reports created by the committee broken down by form type, report type, coverage date, status, version, Date filed, and actions.';

  constructor() {
    super();
    effect(() => {
      if (this.renameF24DialogVisible() === false && this.form24ToUpdate) {
        this.refreshTable();
      }
    });
  }

  protected getEmptyItem(): Report {
    return new Form3X();
  }

  public override async editItem(item: Report): Promise<boolean> {
    if (item.report_status && item.report_status !== ReportStatus.IN_PROGRESS) {
      return this.router.navigateByUrl(`/reports/${item.report_type.toLocaleLowerCase()}/submit/status/${item.id}`);
    }

    switch (item.report_type) {
      case ReportTypes.F3:
      case ReportTypes.F3X:
      case ReportTypes.F24:
        return this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
      case ReportTypes.F99:
        return this.router.navigateByUrl(`/reports/f99/edit/${item.id}`);
      case ReportTypes.F1M:
        return this.router.navigateByUrl(`/reports/f1m/edit/${item.id}`);
    }
  }

  async amendReport(report: Report) {
    await this.itemService.startAmendment(report);
    this.loadTableItems({});
  }

  async unamendReport(report: Report) {
    await this.itemService.startUnamendment(report);
    this.loadTableItems({});
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Unamended',
      life: 3000,
    });
  }

  public confirmDelete(report: Report): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this report? This action cannot be undone.',
      header: 'Hang on...',
      rejectLabel: 'Cancel',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Confirm',
      acceptIcon: 'none',
      accept: async () => this.delete(report),
    });
  }

  public renameForm24(item: Report): void {
    this.form24ToUpdate = item as Form24;
    this.renameF24DialogVisible.set(true);
  }

  async delete(report: Report) {
    await this.itemService.delete(report);
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Deleted',
      life: 3000,
    });
  }

  public async download(report: Report): Promise<void> {
    if (report instanceof Form3X) {
      const payload: Form3X = Form3X.fromJSON({
        ...report,
        qualified_committee: this.committeeAccount().qualified,
      });
      await this.form3XService.update(payload, ['qualified_committee']);
    }
    const download = await this.dotFecService.generateFecFile(report);
    this.dotFecService.checkFecFileTask(download);
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Report): string {
    return item.form_type ?? '';
  }

  public showDialog(): void {
    this.dialogVisible.set(true);
  }
}
