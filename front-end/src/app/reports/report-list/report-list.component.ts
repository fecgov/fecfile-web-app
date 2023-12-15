import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { take, takeUntil } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report } from '../../shared/models/report.model';
import { Form3X } from 'app/shared/models/form-3x.model';
import { LabelList } from '../../shared/utils/label.utils';
import { ReportService } from '../../shared/services/report.service';
import { F3xFormTypeLabels, F3xFormVersionLabels } from 'app/shared/models/form-3x.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit, OnDestroy {
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xFormVerionLabels: LabelList = F3xFormVersionLabels;
  public rowActions: TableAction[] = [
    new TableAction(
      'Edit report',
      this.editItem.bind(this),
      (report: Report) => report.report_status === 'In progress'
    ),
    new TableAction(
      'Amend',
      this.amendReport.bind(this),
      (report: Report) => report.report_status === 'Submission success'
    ),
    new TableAction(
      'Review report',
      this.editItem.bind(this),
      (report: Report) => report.report_status !== 'In progress'
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
      this.router.navigateByUrl(`/reports/f3x/submit/status/${item.id}`);
    } else if (item.is_first) {
      this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
    } else {
      this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
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
    return this.items.length === 1 && !(this.items[0] as Form3X).L8_cash_on_hand_close_ytd;
  }
}
