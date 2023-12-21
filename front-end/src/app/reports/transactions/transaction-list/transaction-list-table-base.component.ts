import { Component, ElementRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { isPulledForwardLoan, ScheduleIds, Transaction } from 'app/shared/models/transaction.model';
import { ReportService } from 'app/shared/services/report.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { ConfirmationService, MessageService } from 'primeng/api';
import { take, takeUntil } from 'rxjs';

@Component({
  template: '',
})
export abstract class TransactionListTableBaseComponent extends TableListBaseComponent<Transaction> implements OnInit {
  abstract scheduleTransactionTypeLabels: LabelList;
  override rowsPerPage = 5;
  paginationPageSizeOptions = [5, 10, 15, 20];
  reportIsEditable = false;

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
      'Aggregate',
      this.forceAggregate.bind(this),
      (transaction: Transaction) =>
        !!transaction.force_unaggregated &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        transaction.transactionType.scheduleId === ScheduleIds.A,
      () => true
    ),
    new TableAction(
      'Unaggregate',
      this.forceUnaggregate.bind(this),
      (transaction: Transaction) =>
        !transaction.force_unaggregated &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        transaction.transactionType.scheduleId === ScheduleIds.A,
      () => true
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === false &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
      () => true
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === true &&
        this.reportIsEditable &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
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
      this.editLoanAgreement.bind(this),
      (transaction: Transaction) =>
        this.reportIsEditable &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        !!transaction.loan_agreement_id,
      () => true
    ),
    new TableAction(
      'New loan agreement',
      this.createLoanAgreement.bind(this),
      (transaction: Transaction) =>
        this.reportIsEditable &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        isPulledForwardLoan(transaction) &&
        !transaction.loan_agreement_id,
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
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentMade.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE &&
        this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentReceived.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE &&
        this.reportIsEditable,
      () => true
    ),
    new TableAction(
      'Reattribute',
      this.createReattribution.bind(this),
      (transaction: Transaction) =>
        transaction.transactionType.scheduleId === ScheduleIds.A &&
        this.reportIsEditable &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REATTRIBUTION_FROM,
          ReattRedesTypes.REATTRIBUTION_TO,
          ReattRedesTypes.REDESIGNATION_FROM,
          ReattRedesTypes.REDESIGNATION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
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

  public onTableActionClick(action: TableAction, report?: Form3X) {
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
    this.router.navigateByUrl(`/reports/transactions/report/${item.report_id}/list/${item.id}`);
  }

  public editLoanAgreement(transaction: Transaction): void {
    if (transaction.loan_agreement_id)
      this.router.navigate([`${transaction.loan_agreement_id}`], { relativeTo: this.activatedRoute });
  }

  public createLoanAgreement(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/list/${transaction.id}/create-sub-transaction/${ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT}`
    );
  }

  public forceAggregate(transaction: Transaction): void {
    this.forceUnaggregation(transaction, false);
  }

  public forceUnaggregate(transaction: Transaction): void {
    this.forceUnaggregation(transaction, true);
  }

  public forceUnaggregation(transaction: Transaction, unaggregated: boolean) {
    transaction.force_unaggregated = unaggregated;
    this.updateItem(transaction);
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
      `/reports/transactions/report/${transaction.report_id}/create/${ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED}?loan=${transaction.id}`
    );
  }

  public createDebtRepaymentReceived(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/select/receipt?debt=${transaction.id}`
    );
  }

  public createLoanRepaymentMade(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/create/${ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE}?loan=${transaction.id}`
    );
  }

  public createDebtRepaymentMade(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/select/disbursement?debt=${transaction.id}`
    );
  }

  public createReattribution(transaction: Transaction): void {
    this.router.navigateByUrl(
      `/reports/transactions/report/${transaction.report_id}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`
    );
  }

  public updateItem(item: Transaction) {
    if (this.itemService.update) {
      this.itemService
        .update(item, false)
        .pipe(take(1), takeUntil(this.destroy$))
        .subscribe(() => {
          this.loadTableItems({});
        });
    }
  }

  public formatId(id: string | null): string {
    if (id) {
      return id.substring(0, 8).toUpperCase();
    }
    return '';
  }
}
