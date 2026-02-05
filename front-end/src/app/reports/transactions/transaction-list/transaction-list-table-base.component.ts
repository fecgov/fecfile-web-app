import { Component, computed, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import { ColumnDefinition, TableBodyContext } from 'app/shared/components/table/table.component';
import {
  Report,
  ReportTypes,
  ScheduleIds,
  ScheduleCTransactionTypes,
  isPulledForwardLoan,
  ScheduleDTransactionTypes,
  ScheduleC1TransactionTypes,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
} from 'app/shared/models';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';

const loanReceipts = ['LOAN_RECEIVED_FROM_BANK_RECEIPT', 'LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT', 'LOAN_MADE'];
const loansDebts = [
  'LOAN_RECEIVED_FROM_INDIVIDUAL',
  'LOAN_RECEIVED_FROM_BANK',
  'LOAN_BY_COMMITTEE',
  'DEBT_OWED_BY_COMMITTEE',
  'DEBT_OWED_TO_COMMITTEE',
];

@Component({
  template: '',
})
export abstract class TransactionListTableBaseComponent
  extends TableListBaseComponent<TransactionListRecord>
  implements OnInit
{
  protected readonly reportService = inject(ReportService);
  protected readonly router = inject(Router);
  protected readonly store = inject(Store);
  protected readonly activatedRoute = inject(ActivatedRoute);
  readonly report = this.store.selectSignal(selectActiveReport);

  abstract scheduleTransactionTypeLabels: LabelList;
  paginationPageSizeOptions = [5, 10, 15, 20];
  readonly reportIsEditable = computed(() => this.reportService.isEditable(this.report()));
  readonly isForm24 = computed(() => this.report().form_type === ReportTypes.F24);

  public rowActions: TableAction<TransactionListRecord>[] = [
    new TableAction(
      'View',
      this.editItem.bind(this),
      () => !this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Edit',
      this.editItem.bind(this),
      () => this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Delete',
      this.deleteItem.bind(this),
      (transaction: TransactionListRecord) => this.reportIsEditable() && this.canDelete(transaction),
      () => true,
    ),
    new TableAction(
      'Aggregate',
      this.forceAggregate.bind(this),
      (transaction: TransactionListRecord) =>
        !!transaction.force_unaggregated &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Unaggregate',
      this.forceUnaggregate.bind(this),
      (transaction: TransactionListRecord) =>
        !transaction.force_unaggregated &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Itemize',
      this.forceItemize.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.itemized === false &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Unitemize',
      this.forceUnitemize.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.itemized === true &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
      () => true,
    ),
    new TableAction(
      'Receive loan repayment',
      this.createLoanRepaymentReceived.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.transaction_type_identifier == ScheduleCTransactionTypes.LOAN_BY_COMMITTEE &&
        this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Review loan agreement',
      this.editLoanAgreement.bind(this),
      (transaction: TransactionListRecord) =>
        this.reportIsEditable() &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        !!transaction.loan_agreement_id,
      () => true,
    ),
    new TableAction(
      'New loan agreement',
      this.createLoanAgreement.bind(this),
      (transaction: TransactionListRecord) =>
        this.reportIsEditable() &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        isPulledForwardLoan(transaction) &&
        !transaction.loan_agreement_id,
      () => true,
    ),
    new TableAction(
      'Make loan repayment',
      this.createLoanRepaymentMade.bind(this),
      (transaction: TransactionListRecord) =>
        [
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
        ].includes(transaction.transaction_type_identifier as ScheduleCTransactionTypes) && this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentMade.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE &&
        this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Report debt repayment',
      this.createDebtRepaymentReceived.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE &&
        this.reportIsEditable(),
      () => true,
    ),
    new TableAction(
      'Reattribute',
      this.createReattribution.bind(this),
      (transaction: TransactionListRecord) =>
        transaction.transactionType.scheduleId === ScheduleIds.A &&
        !transaction.transactionType.negativeAmountValueOnly &&
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
      (transaction: TransactionListRecord) =>
        transaction.transactionType.scheduleId === ScheduleIds.B &&
        transaction.transactionType.hasElectionInformation() &&
        !transaction.transactionType.negativeAmountValueOnly &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REDESIGNATION_FROM,
          ReattRedesTypes.REDESIGNATION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
      () => true,
    ),
  ];

  protected buildLineColumn(): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'line_label',
      header: 'Line',
      sortable: true,
      cssClass: 'line-column',
    };
  }

  protected buildTypeColumn(
    bodyTpl: TemplateRef<TableBodyContext<TransactionListRecord>>,
  ): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'transaction_type_identifier',
      header: 'Type',
      sortable: true,
      cssClass: 'type-column',
      bodyTpl,
    };
  }

  protected buildNameColumn(options?: {
    bodyTpl: TemplateRef<TableBodyContext<TransactionListRecord>>;
  }): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'name',
      header: 'Name',
      sortable: true,
      cssClass: 'name-column',
      ...(options?.bodyTpl && { bodyTpl: options.bodyTpl }),
    };
  }

  protected buildDateColumn(options?: { header?: string; cssClass?: string }): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'date',
      header: options?.header ?? 'Date',
      sortable: true,
      cssClass: options?.cssClass ?? 'date-column',
      pipes: ['fecDate'],
    };
  }

  protected buildAmountColumn(options?: { header?: string }): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'amount',
      header: options?.header ?? 'Amount',
      sortable: true,
      cssClass: 'amount-column',
      pipes: ['currency'],
    };
  }

  protected buildTransactionIdColumn(): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'transaction_id',
      header: 'Transaction ID',
      cssClass: 'transaction-id-column',
      pipes: ['transactionId'],
    };
  }

  protected buildAssociatedWithColumn(): ColumnDefinition<TransactionListRecord> {
    return {
      field: 'back_reference_tran_id_number',
      header: 'Associated With',
      cssClass: 'associated-with-column',
      pipes: ['transactionId'],
    };
  }

  reportId: string = this.activatedRoute.snapshot.params['reportId'];

  ngOnInit() {
    this.rowsPerPage.set(5);
  }

  public onTableActionClick(action: TableAction<Report>, report: Report) {
    action.action(report);
  }

  protected getEmptyItem(): TransactionListRecord {
    return {} as TransactionListRecord;
  }

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    if (this.reportId) params['report_id'] = this.reportId;
    return params;
  });

  override editItem(item: TransactionListRecord): Promise<boolean> {
    return this.router.navigateByUrl(`/reports/transactions/report/${this.reportId}/list/${item.id}`);
  }

  public async editLoanAgreement(transaction: TransactionListRecord): Promise<boolean> {
    if (transaction.loan_agreement_id)
      return this.router.navigate([`${transaction.loan_agreement_id}`], { relativeTo: this.activatedRoute });
    return false;
  }

  public createLoanAgreement(transaction: TransactionListRecord): Promise<boolean> {
    return this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/list/${transaction.id}/create-sub-transaction/${ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT}`,
    );
  }

  public forceAggregate(transaction: TransactionListRecord): Promise<void> {
    return this.forceUnaggregation(transaction, false);
  }

  public forceUnaggregate(transaction: TransactionListRecord): Promise<void> {
    return this.forceUnaggregation(transaction, true);
  }

  async forceUnaggregation(transaction: TransactionListRecord, unaggregated: boolean) {
    transaction.force_unaggregated = unaggregated;
    if (this.itemService.unaggregate) {
      try {
        await this.itemService.unaggregate(transaction, unaggregated);
        this.loadTableItems();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  }

  public forceItemize(transaction: TransactionListRecord): void {
    this.forceItemization(transaction, true);
  }

  public forceUnitemize(transaction: TransactionListRecord): void {
    this.forceItemization(transaction, false);
  }

  async forceItemization(transaction: TransactionListRecord, itemized: boolean) {
    this.confirmationService.confirm({
      message:
        'Changing the itemization status of this transaction will affect its associated transactions (such as memos).',
      header: 'Heads up!',
      accept: async () => {
        transaction.force_itemized = itemized;
        if (this.itemService.itemize) {
          await this.itemService.itemize(transaction, itemized);
          this.loadTableItems();
        }
      },
    });
  }

  public async createLoanRepaymentReceived(transaction: TransactionListRecord): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/create/${ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED}?loan=${transaction.id}`,
    );
  }

  public async createDebtRepaymentReceived(transaction: TransactionListRecord): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/select/receipt?debt=${transaction.id}`,
    );
  }

  public async createLoanRepaymentMade(transaction: TransactionListRecord): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/create/${ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE}?loan=${transaction.id}`,
    );
  }

  public async createDebtRepaymentMade(transaction: TransactionListRecord): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/select/disbursement?debt=${transaction.id}`,
    );
  }

  public async createReattribution(transaction: TransactionListRecord): Promise<void> {
    if (this.reportIsEditable()) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialogSubject.next([transaction, ReattRedesTypes.REATTRIBUTED]);
    }
  }

  public async createRedesignation(transaction: TransactionListRecord): Promise<void> {
    if (this.reportIsEditable()) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?redesignation=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialogSubject.next([transaction, ReattRedesTypes.REDESIGNATED]);
    }
  }

  private canDelete(transaction: TransactionListRecord): boolean {
    if (transaction.transaction_type_identifier) {
      // Shouldn't be able to delete loan receipts
      if (loanReceipts.includes(transaction.transaction_type_identifier)) return false;
      // Shouldn't be able to delete pulled forward loans and debts
      if (loansDebts.includes(transaction.transaction_type_identifier) && (transaction.loan_id || transaction.debt_id))
        return false;
    }

    return !!transaction?.can_delete;
  }

  public override deleteItem(item: TransactionListRecord): void | Promise<void> {
    this.confirmationService.confirm({
      message:
        'Deleting this transaction will also delete any linked transactions ' +
        '(such as memos, in-kinds, and transfers). Please note that you cannot undo this action.',
      accept: () => {
        this.itemService.delete(item).then(() => {
          this.item = this.getEmptyItem();
          this.refreshAllTables();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Transaction Deleted',
          });
        });
      },
    });
  }
}
