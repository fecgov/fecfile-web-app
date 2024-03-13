import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { Form3X } from 'app/shared/models/form-3x.model';
import { ReportTypes, Report } from 'app/shared/models/report.model';
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
  @Input() report?: Report;
  abstract scheduleTransactionTypeLabels: LabelList;
  override rowsPerPage = 5;
  paginationPageSizeOptions = [5, 10, 15, 20];
  reportIsEditable = false;
  reportId: string;

  public rowActions: TableAction[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Aggregate',
      this.forceAggregate.bind(this),
      (transaction: Transaction) =>
        !!transaction.force_unaggregated &&
        this.reportIsEditable &&
        this.report?.report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Unaggregate',
      this.forceUnaggregate.bind(this),
      (transaction: Transaction) =>
        !transaction.force_unaggregated &&
        this.reportIsEditable &&
        this.report?.report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === false &&
        this.reportIsEditable &&
        this.report?.report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: Transaction) =>
        transaction.itemized === true &&
        this.reportIsEditable &&
        this.report?.report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Receive loan repayment',
      this.createLoanRepaymentReceived.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier == ScheduleCTransactionTypes.LOAN_BY_COMMITTEE && this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Review loan agreement',
      this.editLoanAgreement.bind(this),
      (transaction: Transaction) =>
        this.reportIsEditable &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        !!transaction.loan_agreement_id,
      () => true,
    ),
    new TableAction(
      'New loan agreement',
      this.createLoanAgreement.bind(this),
      (transaction: Transaction) =>
        this.reportIsEditable &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        isPulledForwardLoan(transaction) &&
        !transaction.loan_agreement_id,
      () => true,
    ),
    new TableAction(
      'Make loan repayment',
      this.createLoanRepaymentMade.bind(this),
      (transaction: Transaction) =>
        [
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
        ].includes(transaction.transaction_type_identifier as ScheduleCTransactionTypes) && this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentMade.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE &&
        this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentReceived.bind(this),
      (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE &&
        this.reportIsEditable,
      () => true,
    ),
    new TableAction(
      'Reattribute',
      this.createReattribution.bind(this),
      (transaction: Transaction) =>
        transaction.transactionType.scheduleId === ScheduleIds.A &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REATTRIBUTION_FROM,
          ReattRedesTypes.REATTRIBUTION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
      () => true,
    ),
    new TableAction(
      'Redesignate',
      this.createRedesignation.bind(this),
      (transaction: Transaction) =>
        transaction.transactionType.scheduleId === ScheduleIds.B &&
        transaction.transactionType.hasElectionInformation() &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REDESIGNATION_FROM,
          ReattRedesTypes.REDESIGNATION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
      () => true,
    ),
  ];

  protected constructor(
    protected override messageService: MessageService,
    protected override confirmationService: ConfirmationService,
    protected override elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute,
    protected router: Router,
    protected store: Store,
    protected reportService: ReportService,
  ) {
    super(messageService, confirmationService, elementRef);
    this.reportId = this.activatedRoute.snapshot.params['reportId'];
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
    return { report_id: this.reportId, page_size: this.rowsPerPage };
  }

  onRowsPerPageChange() {
    this.loadTableItems({
      first: 0,
      rows: this.rowsPerPage,
    });
  }

  override async editItem(item: Transaction): Promise<void> {
    await this.router.navigateByUrl(`/reports/transactions/report/${this.reportId}/list/${item.id}`);
  }

  public async editLoanAgreement(transaction: Transaction): Promise<void> {
    if (transaction.loan_agreement_id)
      await this.router.navigate([`${transaction.loan_agreement_id}`], { relativeTo: this.activatedRoute });
  }

  public async createLoanAgreement(transaction: Transaction): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/list/${transaction.id}/create-sub-transaction/${ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT}`,
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

  public async createLoanRepaymentReceived(transaction: Transaction): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/create/${ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED}?loan=${transaction.id}`,
    );
  }

  public async createDebtRepaymentReceived(transaction: Transaction): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/select/receipt?debt=${transaction.id}`,
    );
  }

  public async createLoanRepaymentMade(transaction: Transaction): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/create/${ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE}?loan=${transaction.id}`,
    );
  }

  public async createDebtRepaymentMade(transaction: Transaction): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/select/disbursement?debt=${transaction.id}`,
    );
  }

  public async createReattribution(transaction: Transaction): Promise<void> {
    if (this.reportIsEditable) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialogSubject.next([transaction, ReattRedesTypes.REATTRIBUTED]);
    }
  }

  public async createRedesignation(transaction: Transaction): Promise<void> {
    if (this.reportIsEditable) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?redesignation=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialogSubject.next([transaction, ReattRedesTypes.REDESIGNATED]);
    }
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
      return id.substring(0, 8).toUpperCase();
    }
    return '';
  }
}
