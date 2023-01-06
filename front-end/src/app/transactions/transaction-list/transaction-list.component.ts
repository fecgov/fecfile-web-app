import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent extends TableListBaseComponent<Transaction> implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary | undefined;
  scheduleATransactionTypeLabels: LabelList = ScheduleATransactionTypeLabels;

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private store: Store
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit(): void {
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => (this.report = report as F3xSummary));

    this.loading = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override getGetParams(): { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return { report_id: reportId };
  }
}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
