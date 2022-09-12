import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCashOnHand } from '../../store/cash-on-hand.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report, CashOnHand } from '../../shared/interfaces/report.interface';
import { LabelList } from '../../shared/utils/label.utils';
import { ReportCodeLabelList } from '../../shared/utils/reportCodeLabels.utils';
import { ReportService } from '../../shared/services/report.service';
import { F3xSummary, F3xFormTypeLabels, F3xFormVersionLabels } from 'app/shared/models/f3x-summary.model';
import { Router } from '@angular/router';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { updateLabelLookupAction } from '../../store/label-lookup.actions';

@Component({
  selector: 'app-report-list',
  templateUrl: './report-list.component.html',
})
export class ReportListComponent extends TableListBaseComponent<Report> implements OnInit, OnDestroy {
  f3xFormTypeLabels: LabelList = F3xFormTypeLabels;
  f3xFormVerionLabels: LabelList = F3xFormVersionLabels;
  reportCodeLabelList$: Observable<ReportCodeLabelList> = new Observable<ReportCodeLabelList>();
  cashOnHand: CashOnHand = {
    report_id: undefined,
    value: null,
  };
  private destroy$ = new Subject<boolean>();

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
    this.reportCodeLabelList$ = this.store
      .select<ReportCodeLabelList>(selectReportCodeLabelList)
      .pipe(takeUntil(this.destroy$));

    this.store.dispatch(updateLabelLookupAction());

    this.store
      .select(selectCashOnHand)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cashOnHand: CashOnHand) => {
        this.cashOnHand = cashOnHand;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected getEmptyItem(): F3xSummary {
    return new F3xSummary();
  }

  public override addItem(): void {
    this.router.navigateByUrl('/reports/f3x/create/step1');
  }

  public override editItem(item: Report): void {
    if (!this.itemService.isEditable(item)) {
      this.router.navigateByUrl(`/reports/f3x/submit/status/${item.id}`);
    } else if (item.id === this.cashOnHand.report_id) {
      this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
    } else {
      this.router.navigateByUrl(`/transactions/report/${item.id}/list`);
    }
  }

  public goToTest(item: Report): void {
    this.router.navigateByUrl(`/reports/f3x/test-dot-fec/${item.id}`);
  }

  public createTransaction(item: Report): void {
    this.router.navigateByUrl(`/transactions/report/${item.id}/create`);
  }

  /**
   * Get the display name for the contact to show in the table column.
   * @param item
   * @returns {string} Returns the appropriate name of the contact for display in the table.
   */
  public displayName(item: Report): string {
    return item.form_type;
  }
}
