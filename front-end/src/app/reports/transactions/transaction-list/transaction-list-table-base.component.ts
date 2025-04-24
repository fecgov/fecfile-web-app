import { Component, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { createAction, TableListBaseComponent } from 'app/shared/components/table-list-base/table-list-base.component';
import {
  Transaction,
  ReportTypes,
  ScheduleIds,
  ScheduleCTransactionTypes,
  isPulledForwardLoan,
  ScheduleDTransactionTypes,
  ScheduleC1TransactionTypes,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
} from 'app/shared/models';
import { QueryParams } from 'app/shared/services/api.service';
import { ReportService } from 'app/shared/services/report.service';
import { LabelList } from 'app/shared/utils/label.utils';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { take } from 'rxjs';
import { injectDestroy } from 'ngxtension/inject-destroy';

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
export abstract class TransactionListTableBaseComponent extends TableListBaseComponent<Transaction> {
  protected readonly reportService = inject(ReportService);
  protected readonly router = inject(Router);
  protected readonly store = inject(Store);
  protected readonly activatedRoute = inject(ActivatedRoute);
  private readonly destroy$ = injectDestroy();

  readonly report = this.store.selectSignal(selectActiveReport);
  abstract scheduleTransactionTypeLabels: LabelList;
  override rowsPerPage = signal(5);
  paginationPageSizeOptions = [5, 10, 15, 20];
  readonly reportIsEditable = computed(() => this.reportService.isEditable(this.report()));

  public rowActions = [
    createAction('View', this.editItem.bind(this), { isAvailable: () => !this.reportIsEditable }),
    createAction('Edit', this.editItem.bind(this), { isAvailable: () => !this.reportIsEditable }),
    createAction('Delete', this.deleteItem.bind(this), {
      isAvailable: (transaction: Transaction) => this.reportIsEditable() && this.canDelete(transaction),
    }),
    createAction('Aggregate', this.forceAggregate.bind(this), {
      isAvailable: (transaction: Transaction) =>
        !!transaction.force_unaggregated &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
    }),
    createAction('Unaggregate', this.forceUnaggregate.bind(this), {
      isAvailable: (transaction: Transaction) =>
        !transaction.force_unaggregated &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        [ScheduleIds.A, ScheduleIds.E].includes(transaction.transactionType.scheduleId),
    }),
    createAction('Itemize', this.forceItemize.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.itemized === false &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
    }),
    createAction('Unitemize', this.forceUnitemize.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.itemized === true &&
        this.reportIsEditable() &&
        this.report().report_type !== ReportTypes.F24 &&
        !transaction.parent_transaction &&
        !transaction.parent_transaction_id &&
        ![ScheduleIds.C, ScheduleIds.D].includes(transaction.transactionType.scheduleId),
    }),
    createAction('Receive loan repayment', this.createLoanRepaymentReceived.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.transaction_type_identifier == ScheduleCTransactionTypes.LOAN_BY_COMMITTEE &&
        this.reportIsEditable(),
    }),
    createAction('Review loan agreement', this.editLoanAgreement.bind(this), {
      isAvailable: (transaction: Transaction) =>
        this.reportIsEditable() &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        !!transaction.loan_agreement_id,
    }),
    createAction('New loan agreement', this.createLoanAgreement.bind(this), {
      isAvailable: (transaction: Transaction) =>
        this.reportIsEditable() &&
        transaction.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
        isPulledForwardLoan(transaction) &&
        !transaction.loan_agreement_id,
    }),
    createAction('Make loan repayment', this.createLoanRepaymentMade.bind(this), {
      isAvailable: (transaction: Transaction) =>
        [
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
          ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
        ].includes(transaction.transaction_type_identifier as ScheduleCTransactionTypes) && this.reportIsEditable(),
    }),
    createAction('Report debt repayment', this.createDebtRepaymentMade.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE &&
        this.reportIsEditable(),
    }),
    createAction('Report debt repayment', this.createDebtRepaymentReceived.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE &&
        this.reportIsEditable(),
    }),
    createAction('Reattribute', this.createReattribution.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.transactionType.scheduleId === ScheduleIds.A &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REATTRIBUTION_FROM,
          ReattRedesTypes.REATTRIBUTION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
    }),
    createAction('Redesignate', this.createRedesignation.bind(this), {
      isAvailable: (transaction: Transaction) =>
        transaction.transactionType.scheduleId === ScheduleIds.B &&
        transaction.transactionType.hasElectionInformation() &&
        !transaction.parent_transaction_id &&
        !ReattRedesUtils.isReattRedes(transaction, [
          ReattRedesTypes.REDESIGNATION_FROM,
          ReattRedesTypes.REDESIGNATION_TO,
        ]) &&
        !ReattRedesUtils.isAtAmountLimit(transaction),
    }),
  ];

  sortableHeaders: { field: string; label: string }[] = [
    { field: 'line_label,created', label: 'Line' },
    { field: 'transaction_type_identifier', label: 'Type' },
    { field: 'name', label: 'Name' },
  ];

  readonly reportId: string = this.activatedRoute.snapshot.params['reportId'];

  protected getEmptyItem(): Transaction {
    return {} as Transaction;
  }

  override readonly params = computed(() => {
    const params: QueryParams = { page_size: this.rowsPerPage() };
    if (this.reportId) params['report_id'] = this.reportId;
    return params;
  });

  override editItem(item: Transaction): Promise<boolean> {
    return this.router.navigateByUrl(`/reports/transactions/report/${this.reportId}/list/${item.id}`);
  }

  public async editLoanAgreement(transaction: Transaction): Promise<boolean> {
    if (transaction.loan_agreement_id)
      return this.router.navigate([`${transaction.loan_agreement_id}`], { relativeTo: this.activatedRoute });
    return false;
  }

  public createLoanAgreement(transaction: Transaction): Promise<boolean> {
    return this.router.navigateByUrl(
      `/reports/transactions/report/${this.reportId}/list/${transaction.id}/create-sub-transaction/${ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT}`,
    );
  }

  public forceAggregate(transaction: Transaction): Promise<void> {
    return this.forceUnaggregation(transaction, false);
  }

  public forceUnaggregate(transaction: Transaction): Promise<void> {
    return this.forceUnaggregation(transaction, true);
  }

  public forceUnaggregation(transaction: Transaction, unaggregated: boolean) {
    transaction.force_unaggregated = unaggregated;
    return this.updateItem(transaction);
  }

  public forceItemize(transaction: Transaction): void {
    this.forceItemization(transaction, true);
  }

  public forceUnitemize(transaction: Transaction): void {
    this.forceItemization(transaction, false);
  }

  public forceItemization(transaction: Transaction, itemized: boolean) {
    this.confirmationService.confirm({
      key: 'transaction-itemization-dialog',
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
    if (this.reportIsEditable()) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialog.set([transaction, ReattRedesTypes.REATTRIBUTED]);
    }
  }

  public async createRedesignation(transaction: Transaction): Promise<void> {
    if (this.reportIsEditable()) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${this.reportId}/create/${transaction.transaction_type_identifier}?redesignation=${transaction.id}`,
      );
    } else {
      ReattRedesUtils.selectReportDialog.set([transaction, ReattRedesTypes.REDESIGNATED]);
    }
  }

  public async updateItem(item: Transaction) {
    if (this.itemService.update) {
      try {
        await this.untilDestroyed(this.itemService.update(item));
        this.loadTableItems({});
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  }

  private untilDestroyed<T>(promise: Promise<T>): Promise<T> {
    return Promise.race([
      promise,
      new Promise<T>((_, reject) => {
        this.destroy$.pipe(take(1)).subscribe(() => reject(new Error('Destroyed')));
      }),
    ]);
  }

  public formatId(id: string | null): string {
    if (id) {
      return id.substring(0, 8).toUpperCase();
    }
    return '';
  }

  private canDelete(transaction: Transaction): boolean {
    if (transaction.transaction_type_identifier) {
      // Shouldn't be able to delete loan receipts
      if (loanReceipts.includes(transaction.transaction_type_identifier)) return false;
      // Shouldn't be able to delete pulled forward loans and debts
      if (loansDebts.includes(transaction.transaction_type_identifier) && (transaction.loan_id || transaction.debt_id))
        return false;
    }

    return !!transaction?.can_delete;
  }

  public override deleteItem(item: Transaction): void | Promise<void> {
    this.confirmationService.confirm({
      key: 'transaction-deletion-dialog',
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
