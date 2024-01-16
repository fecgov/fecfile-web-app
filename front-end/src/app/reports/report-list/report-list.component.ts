import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report, ReportTypes, ReportStatus } from '../../shared/models/report.model';
import { ReportService } from '../../shared/services/report.service';
import { Form3X } from 'app/shared/models/form-3x.model';
import { Router } from '@angular/router';

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
      (report: Report) => report.report_status === ReportStatus.IN_PROGRESS
    ),
    new TableAction('Amend', this.amendReport.bind(this), (report: Report) => report.canAmend),
    new TableAction(
      'Review report',
      this.editItem.bind(this),
      (report: Report) => report.report_status !== ReportStatus.IN_PROGRESS
    ),
    new TableAction('Download as .fec', this.goToTest.bind(this)),
  ];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: ReportService,
    public router: Router
  ) {
    super(messageService, confirmationService, elementRef);
    this.caption =
      'Data table of all reports created by the committee broken down by form type, report type, coverage date, status, version, Date filed, and actions.';
  }

  override ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);
  }

  protected getEmptyItem(): Report {
    return new Form3X();
  }

  public override editItem(item: Report): void {
    if (!this.itemService.isEditable(item)) {
      this.router.navigateByUrl(`/reports/${item.report_type.toLocaleLowerCase()}/submit/status/${item.id}`);
      return;
    }

    switch (item.report_type) {
      case ReportTypes.F3X:
        if (item.is_first) {
          this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
        } else {
          this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
        }
        break;
      case ReportTypes.F99:
        this.router.navigateByUrl(`/reports/f99/edit/${item.id}`);
        break;
      case ReportTypes.F24:
        this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
        break;
      case ReportTypes.F1M:
        this.router.navigateByUrl(`/reports/f1m/edit/${item.id}`);
        break;
    }
  }

  public amendReport(report: Report): void {
    this.itemService
      .startAmendment(report)
      .pipe(take(1), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadTableItems({});
      });
  }

  public goToTest(item: Report): void {
    this.router.navigateByUrl(`/reports/f3x/test-dot-fec/${item.id}`);
  }

  public onRowActionClick(action: TableAction, report: Report) {
    action.action(report);
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
