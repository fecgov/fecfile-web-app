import { Component, ElementRef, OnDestroy, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { ScheduleATransactionTypeLabels } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypeLabels } from 'app/shared/models/schb-transaction.model';
import { Transaction } from 'app/shared/models/transaction.model';
import { TransactionService } from 'app/shared/services/transaction.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

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
      this.createTransactions.bind(this, 'loans-and-debts'),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => false
    ),
    new TableAction(
      'Add other transactions',
      this.createTransactions.bind(this, 'other-transactions'),
      (report: F3xSummary) => report.report_status === 'In-Progress',
      () => false
    ),
  ];
  public rowActions: TableAction[] = [
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => true,
      () => true
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: Transaction) => transaction.itemized === false,
      () => true
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: Transaction) => transaction.itemized === true,
      () => true
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

  public onRowActionClick(action: TableAction, transaction: Transaction) {
    action.action(transaction);
  }

  public forceItemize(transaction: Transaction): void {
    transaction.force_itemized = true;
    this.updateItem(transaction);
  }

  public forceUnitemize(transaction: Transaction): void {
    transaction.force_itemized = false;
    this.updateItem(transaction);
  }

  public updateItem(item: Transaction) {
    this.itemService.update(item).subscribe(() => {
      this.loadTableItems({});
    });
  }

}

@Pipe({ name: 'memoCode' })
export class MemoCodePipe implements PipeTransform {
  transform(value: boolean) {
    return value ? 'Y' : '-';
  }
}
