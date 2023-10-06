import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCashOnHand } from '../../store/cash-on-hand.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableAction, TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report } from '../../shared/models/report.model';
import { CashOnHand, ReportF3X } from '../../shared/models/report-f3x.model';
import { LabelList } from '../../shared/utils/label.utils';
import { ReportService } from '../../shared/services/report.service';
import { F3xFormTypeLabels, F3xFormVersionLabels } from 'app/shared/models/report-f3x.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit, OnDestroy {
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xFormVerionLabels: LabelList = F3xFormVersionLabels;
  cashOnHand: CashOnHand = {
    report_id: undefined,
    value: undefined,
  };
  public rowActions: TableAction[] = [
    new TableAction(
      'Edit report',
      this.editItem.bind(this),
      (report: Report) => report.report_status === 'In progress'
    ),
    new TableAction(
      'Review report',
      this.editItem.bind(this),
      (report: Report) => report.report_status !== 'In progress'
    ),
    new TableAction('Download as .fec', this.goToTest.bind(this)),
  ];

  constructor(
    private store: Store,
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: ReportService,
    public router: Router
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit() {
    this.loading = true;
    this.loadItemService(this.itemService);

    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand: CashOnHand) => {
        this.cashOnHand = cashOnHand;
      });
  }

  protected getEmptyItem(): Report {
    return new ReportF3X();
  }

  public override editItem(item: Report): void {
    if (!this.itemService.isEditable(item)) {
      this.router.navigateByUrl(`/reports/f3x/submit/status/${item.id}`);
    } else if (item.id === this.cashOnHand.report_id) {
      this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
    } else {
      this.router.navigateByUrl(`/reports/transactions/report/${item.id}/list`);
    }
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
}
