import { Component, inject, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Report, ReportStatus } from 'app/shared/models';
import { DotFecService } from 'app/shared/services/dot-fec.service';
import { getReportFromJSON, ReportService } from 'app/shared/services/report.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ColumnDefinition } from 'app/shared/components/table/table.component';
import { SharedTemplatesComponent } from './shared-templates.component';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';

@Component({ template: '' })
export abstract class AbstractFormListComponent<T extends Report> extends TableListBaseComponent<T> {
  protected abstract override readonly itemService: ReportService<T>;
  protected readonly router = inject(Router);
  readonly dotFecService = inject(DotFecService);
  private readonly store = inject(Store);
  private readonly committeeAccount = this.store.selectSignal(selectCommitteeAccount);

  override readonly rowsPerPage = signal(5);

  readonly sharedTemplate = viewChild.required(SharedTemplatesComponent<T>);
  columns: ColumnDefinition<T>[] = [];

  readonly rowActions: TableAction<T>[] = [
    new TableAction('Edit', this.editItem.bind(this), (report: T) => report.report_status === ReportStatus.IN_PROGRESS),
    new TableAction('Amend', this.amendReport.bind(this), (report: T) => report.canAmend),
    new TableAction(
      'Review',
      this.editItem.bind(this),
      (report: T) => report.report_status !== ReportStatus.IN_PROGRESS,
    ),
    new TableAction('Delete', this.confirmDelete.bind(this), (report: T) => report.can_delete),
    new TableAction('Unamend', this.unamendReport.bind(this), (report: T) => report.can_unamend),
    new TableAction('Download as .fec', this.download.bind(this)),
  ];

  override ngAfterViewInit(): void {
    this.columns = [
      { field: 'formSubLabel', header: 'Type', sortable: true, cssClass: 'type-column' },
      { field: 'report_status', header: 'Status', sortable: true, cssClass: 'status-column' },
      { field: 'version_label', header: 'Version', sortable: true, cssClass: 'version-column' },
      {
        field: 'upload_submission__created',
        header: 'Filed',
        sortable: true,
        cssClass: 'submission-column',
        bodyTpl: this.sharedTemplate().submissionBodyTpl(),
      },
      {
        field: 'actions',
        header: 'Actions',
        sortable: false,
        cssClass: 'actions-column',
        bodyTpl: this.sharedTemplate().actionsBodyTpl(),
        actions: this.rowActions,
      },
    ];
  }

  public confirmDelete(report: T): void {
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

  async delete(report: T) {
    await this.itemService.delete(report);
    this.refreshTable();
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Deleted',
      life: 3000,
    });
  }

  override async editItem(item: T): Promise<boolean> {
    if (item.report_status && item.report_status !== ReportStatus.IN_PROGRESS) {
      return this.router.navigateByUrl(`/reports/${item.report_type.toLocaleLowerCase()}/submit/status/${item.id}`);
    }

    return this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
  }

  async download(report: T): Promise<void> {
    const payload = getReportFromJSON<T>({
      ...report,
      qualified_committee: this.committeeAccount().qualified,
    });

    await this.itemService.update(payload, ['qualified_committee']);
    const download = await this.dotFecService.generateFecFile(report);
    return this.dotFecService.checkFecFileTask(download);
  }

  async amendReport(report: T) {
    await this.itemService.startAmendment(report);
    this.loadTableItems({});
  }

  async unamendReport(report: T) {
    await this.itemService.startUnamendment(report);
    this.loadTableItems({});
    this.messageService.add({
      severity: 'success',
      summary: 'Successful',
      detail: 'Report Unamended',
      life: 3000,
    });
  }
}
