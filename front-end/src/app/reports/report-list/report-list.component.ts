import { Component, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCohNeededStatus } from 'app/store/coh-needed.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableListBaseComponent } from '../../shared/components/table-list-base/table-list-base.component';
import { Report } from '../../shared/interfaces/report.interface';
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
  cohNeededFlag = false;
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
    this.reportCodeLabelList$ = this.store.select<ReportCodeLabelList>(selectReportCodeLabelList);
    this.store.dispatch(updateLabelLookupAction());

    this.store
      .select(selectCohNeededStatus)
      .pipe(takeUntil(this.destroy$))
      .subscribe((cohNeededFlag: boolean) => {
        this.cohNeededFlag = cohNeededFlag;
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
    if (this.cohNeededFlag) {
      this.router.navigateByUrl(`/reports/f3x/create/cash-on-hand/${item.id}`);
    } else if ((item as F3xSummary).change_of_address === null) {
      this.router.navigateByUrl(`/reports/f3x/create/step2/${item.id}`);
    } else {
      this.router.navigateByUrl(`/reports/f3x/create/step3/${item.id}`);
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
