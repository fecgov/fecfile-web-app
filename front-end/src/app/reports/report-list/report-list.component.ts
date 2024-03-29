import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { lastValueFrom, take, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report, ReportStatus, ReportTypes } from '../../shared/models/report.model';
import { ReportService } from '../../shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Router } from '@angular/router';
import { TableLazyLoadEvent } from 'primeng/table';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit, OnDestroy {
  dialogVisible = false;
  public rowActions: TableAction[] = [
    new TableAction(
      'Edit report',
      this.editItem.bind(this),
      (report: Report) => report.report_status === ReportStatus.IN_PROGRESS,
    ),
    new TableAction('Amend', this.amendReport.bind(this), (report: Report) => report.canAmend),
    new TableAction(
      'Review report',
      this.editItem.bind(this),
      (report: Report) => report.report_status !== ReportStatus.IN_PROGRESS,
    ),
    new TableAction('Delete', this.deleteReport.bind(this), (report: Report) => !!this.canDeleteMap.get(report)),
    new TableAction('Download as .fec', this.goToTest.bind(this)),
  ];

  canDeleteMap: Map<Report, boolean> = new Map();

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    override itemService: ReportService,
    public router: Router,
  ) {
    super(messageService, confirmationService, elementRef);
    this.caption =
      'Data table of all reports created by the committee broken down by form type, report type, coverage date, status, version, Date filed, and actions.';
  }

  override ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
  }

  override async loadTableItems(event: TableLazyLoadEvent) {
    await super.loadTableItems(event);
    this.items.forEach((item) => this.canDelete(item));
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
        if (item.is_first) {
          await this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
        } else {
          await this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
        }
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

  public async amendReport(report: Report): Promise<void> {
    await lastValueFrom(this.itemService.startAmendment(report).pipe(take(1), takeUntil(this.destroy$)));
    await this.loadTableItems({});
  }

  public async canDelete(report: Report) {
    this.canDeleteMap.set(
      report,
      report.report_status == ReportStatus.IN_PROGRESS && (await this.itemService.canDelete(report)),
    );
  }

  public deleteReport(report: Report): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this report? This action cannot be undone',
      header: 'Hang on...',
      rejectLabel: 'Cancel',
      rejectIcon: 'none',
      rejectButtonStyleClass: 'p-button-secondary',
      acceptLabel: 'Confirm',
      acceptIcon: 'none',
      accept: async () => {
        await lastValueFrom(this.itemService.delete(report));
        this.refreshTable();
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          detail: 'Report Deleted',
          life: 3000,
        });
      },
    });
  }

  public async goToTest(item: Report): Promise<void> {
    await this.router.navigateByUrl(`/reports/f3x/test-dot-fec/${item.id}`);
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Report): string {
    return item.form_type ?? '';
  }

  public noCashOnHand(): boolean {
    const f3xItems = this.items.filter((i) => i.report_type === ReportTypes.F3X);
    return f3xItems.length === 1 && !(f3xItems[0] as Form3X).cash_on_hand_date;
  }

  public showDialog(): void {
    this.dialogVisible = true;
  }
}
