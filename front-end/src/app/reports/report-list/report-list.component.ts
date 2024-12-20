import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { DotFecService } from 'app/shared/services/dot-fec.service';
import { Form3XService } from 'app/shared/services/form-3x.service';
import { selectCommitteeAccount } from 'app/store/committee-account.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom, lastValueFrom } from 'rxjs';
import { TableAction, TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report, ReportStatus, ReportTypes } from '../../shared/models/report.model';
import { ReportService } from '../../shared/services/report.service';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
  styleUrls: ['./report-list.component.scss'],
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit, OnDestroy {
  dialogVisible = false;
  committeeAccount?: CommitteeAccount;
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
  ];

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'form_type', label: 'Form' },
    { field: 'report_code_label', label: 'Type' },
    { field: 'coverage_through_date', label: 'Coverage' },
    { field: 'report_status', label: 'Status' },
    { field: 'version_label', label: 'Version' },
    { field: 'upload_submission__created', label: 'Filed' },
  ];

  constructor(
    override messageService: MessageService,
    override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    override itemService: ReportService,
    public router: Router,
    private store: Store,
    private form3XService: Form3XService,
    public dotFecService: DotFecService,
  ) {
    super(messageService, confirmationService, elementRef);
    this.caption =
      'Data table of all reports created by the committee broken down by form type, report type, coverage date, status, version, Date filed, and actions.';
  }

  override ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
    this.store.select(selectCommitteeAccount).subscribe((committeeAccount) => {
      this.committeeAccount = committeeAccount;
    });
  }

  protected getEmptyItem(): Report {
    return new Form3X();
  }

  public override async editItem(item: Report): Promise<void> {
    if (!this.itemService.isEditable(item)) {
      await this.router.navigateByUrl(`/reports/${item.report_type.toLocaleLowerCase()}/submit/status/${item.id}`);
      return;
    }

    switch (item.report_type) {
      case ReportTypes.F3X:
        await this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
        break;
      case ReportTypes.F99:
        await this.router.navigateByUrl(`/reports/f99/edit/${item.id}`);
        break;
      case ReportTypes.F24:
        await this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
        break;
      case ReportTypes.F1M:
        await this.router.navigateByUrl(`/reports/f1m/edit/${item.id}`);
        break;
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

  async delete(report: Report) {
    await lastValueFrom(this.itemService.delete(report));
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
        qualified_committee: this.committeeAccount?.qualified,
      });
      await firstValueFrom(this.form3XService.update(payload, ['qualified_committee']));
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
    this.dialogVisible = true;
  }
}
