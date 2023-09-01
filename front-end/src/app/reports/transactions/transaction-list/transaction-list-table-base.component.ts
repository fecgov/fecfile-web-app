import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { take, takeUntil } from 'rxjs';
import { F3xSummary } from 'app/shared/models/f3x-summary.model';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Transaction } from 'app/shared/models/transaction.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LabelList, LineIdentifierLabels } from 'app/shared/utils/label.utils';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ReportService } from 'app/shared/services/report.service';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';

@Component({
  template: '',
})
export abstract class TransactionListTableBaseComponent extends TableListBaseComponent<Transaction> implements OnInit {
  abstract scheduleTransactionTypeLabels: LabelList;
  override rowsPerPage = 5;
  paginationPageSizeOptions = [5, 10, 15, 20];
  reportIsEditable = false;
  lineLabels = LineIdentifierLabels;

  public rowActions: TableAction[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === false &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id,
      () => true
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === true &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id,
      () => true
    ),
    new TableAction(
      'Receive loan repayment',
      this.createLoanRepaymentReceived.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier == ScheduleCTransactionTypes.LOAN_BY_COMMITTEE && this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Review loan agreement',
      this.editSecondChild.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
      () => true
    ),
    new TableAction(
      'Make loan repayment',
      this.createLoanRepaymentMade.bind(this),
      (transaction: Transaction) =>
        [
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
        ].includes(transaction.transaction_type_identifier as ScheduleCTransactionTypes) && this.reportIsEditable,
      () => true
    ),
  ];

  constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected store: Store,
    protected reportService: ReportService
  ) {
    super(messageService, confirmationService, elementRef);
  }

  override ngOnInit(): void {
    this.loading = true;
    this.store
      .select(selectActiveReport)
      .pipe(takeUntil(this.destroy$))
      .subscribe((report) => {
        this.reportIsEditable = this.reportService.isEditable(report);
      });
  }

  public onTableActionClick(action: TableAction, report?: F3xSummary) {
    action.action(report);
  }

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override getGetParams(): { [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean> } {
    const reportId = this.activatedRoute.snapshot.params['reportId'];
    return { report_id: reportId, page_size: this.rowsPerPage };
  }

  onRowsPerPageChange() {
    this.loadTableItems({
      first: 0,
      rows: this.rowsPerPage,
    });
  }

  public onRowActionClick(action: TableAction, transaction: Transaction) {
    action.action(transaction);
  }

  override editItem(item: Transaction): void {
    this.router.navigate([`${item.id}`], { relativeTo: this.activatedRoute });
  }

  public editFirstChild(item: Transaction): void {
    if (item.children?.length && item.children.length > 0)
      this.router.navigate([`${item.children[0].id}`], { relativeTo: this.activatedRoute });
  }

  public editSecondChild(item: Transaction): void {
    if (item.children?.length && item.children.length > 1)
      this.router.navigate([`${item.children[1].id}`], { relativeTo: this.activatedRoute });
  }

  public forceItemize(transaction: Transaction): void {
    this.forceItemization(transaction, true);
  }

  public forceUnitemize(transaction: Transaction): void {
    this.forceItemization(transaction, false);
  }

  public forceItemization(transaction: Transaction, itemized: boolean) {
    this.confirmationService.confirm({
      message:
        'Changing the itemization status of this transaction will affect its associated transactions (such as memos).',
      header: 'Heads up!',
      accept: () => {
        transaction.force_itemized = itemized;
        this.updateItem(transaction);
      },
    });
  }

  public createLoanRepaymentReceived(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/list/${transaction.id}/create-sub-transaction/${ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED}`
    );
  }

  public createLoanRepaymentMade(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/list/${transaction.id}/create-sub-transaction/${ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE}`
    );
  }

  public updateItem(item: Transaction) {
    if (this.itemService.update) {
      this.itemService
        .update(item)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadTableItems({});
        });
    }
  }

  public formatId(id: string | null): string {
    if (id) {
      return id.split('-')[0].toUpperCase();
    }
    return '';
  }
}
