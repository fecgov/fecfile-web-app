import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionService } from 'app/shared/services/transaction.service';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { LabelList } from 'app/shared/utils/label.utils';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
})
export class TransactionListComponent extends TableListBaseComponent<Transaction> implements OnInit, OnDestroy {
  private destroy$ = new Subject<boolean>();
  report: F3xSummary | undefined;
  scheduleTransactionTypeLabels: LabelList = [...ScheduleATransactionTypeLabels, ...ScheduleBTransactionTypeLabels];

  public tableActions: TableAction[] = [
    new TableAction(
      'Add a receipt',
      this.createTransactions.bind(this, 'receipt'),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => true
    ),
    new TableAction(
      'Add a disbursement',
      this.createTransactions.bind(this, 'disbursement'),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => true
    ),
    new TableAction(
      'Add loans and debts',
      this.createTransactions.bind(this),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => false
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => false
    ),
  ];
  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected override itemService: TransactionService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
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

  createTransactions(transactionCategory: string, report?: F3xSummary): void {
    this.router.navigateByUrl(`/transactions/report/${report?.id}/select/${transactionCategory}`);
  }

  public onTableActionClick(action: TableAction, report?: F3xSummary) {
    action.action(report);
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
