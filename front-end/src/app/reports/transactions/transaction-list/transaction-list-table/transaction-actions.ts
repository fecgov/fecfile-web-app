import { inject, Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TableAction } from 'app/shared/components/table-actions-button/table-actions';
import { ReportTypes, type Report } from 'app/shared/models/reports/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { ScheduleC1TransactionTypes } from 'app/shared/models/schc1-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { TransactionListRecord } from 'app/shared/models/transaction-list-record.model';
import { isPulledForwardLoan, ScheduleIds } from 'app/shared/models/transaction.model';
import { ReportService } from 'app/shared/services/report.service';
import { ReattRedesStore } from 'app/shared/utils/reatt-redes/reatt-redes.store';
import { ReattRedesTypes, ReattRedesUtils } from 'app/shared/utils/reatt-redes/reatt-redes.utils';
import { isCloneable } from 'app/shared/utils/transaction-clone.utils';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TransactionCategory } from './transaction-category.config';
import { TransactionListService } from 'app/shared/services/transaction-list.service';

interface ActionContext {
  category: TransactionCategory;
  report: Report | null;
  isUnassigned?: boolean;
  reloadTable: () => Promise<void>;
  deleteItem: (transaction: TransactionListRecord) => void;
  onRequestF24Selection?: (transaction: TransactionListRecord) => void;
}

export abstract class BaseTransactionActionsFactory {
  protected readonly router = inject(Router);
  protected readonly transactionService = inject(TransactionListService);

  abstract buildActions(ctx: ActionContext): TableAction<TransactionListRecord>[];

  protected canDelete(transaction: TransactionListRecord): boolean {
    const loanReceipts = new Set([
      'LOAN_RECEIVED_FROM_BANK_RECEIPT',
      'LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT',
      'LOAN_MADE',
    ]);
    const loansDebts = new Set([
      'LOAN_RECEIVED_FROM_INDIVIDUAL',
      'LOAN_RECEIVED_FROM_BANK',
      'LOAN_BY_COMMITTEE',
      'DEBT_OWED_BY_COMMITTEE',
      'DEBT_OWED_TO_COMMITTEE',
    ]);

    if (transaction.transaction_type_identifier) {
      if (loanReceipts.has(transaction.transaction_type_identifier)) return false;
      if (loansDebts.has(transaction.transaction_type_identifier) && (transaction.loan_id || transaction.debt_id))
        return false;
    }
    return !!transaction?.can_delete;
  }
}

@Injectable()
export class AssignedTransactionActionsFactory extends BaseTransactionActionsFactory {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly reatRedesStore = inject(ReattRedesStore);
  private readonly messageService = inject(MessageService);
  private readonly reportService = inject(ReportService);
  private readonly confirmationService = inject(ConfirmationService);

  public buildActions(ctx: ActionContext): TableAction<TransactionListRecord>[] {
    const reportId = ctx.report?.id ?? '';
    const reportIsEditable = ctx.report ? this.reportService.isEditable(ctx.report) : false;
    const isF24 = ctx.report?.report_type === ReportTypes.F24;

    const actions: TableAction<TransactionListRecord>[] = [
      new TableAction(
        'View',
        (item) => this.editItem(item, reportId),
        () => !reportIsEditable,
        () => true,
      ),
      new TableAction(
        'Edit',
        (item) => this.editItem(item, reportId),
        () => reportIsEditable,
        () => true,
      ),
      new TableAction(
        'Clone',
        (item) => this.cloneItem(item, reportId),
        (item) => reportIsEditable && isCloneable(item),
        () => true,
      ),
      new TableAction(
        'Delete',
        (item) => ctx.deleteItem(item),
        (item) => reportIsEditable && this.canDelete(item),
        () => true,
      ),
      new TableAction(
        'Aggregate',
        (item) => this.forceUnaggregation(item, false, ctx.reloadTable),
        (item) =>
          !!item.force_unaggregated &&
          reportIsEditable &&
          !isF24 &&
          !item.parent_transaction_id &&
          [ScheduleIds.A, ScheduleIds.E].includes(item.transactionType.scheduleId),
        () => true,
      ),
      new TableAction(
        'Unaggregate',
        (item) => this.forceUnaggregation(item, true, ctx.reloadTable),
        (item) =>
          !item.force_unaggregated &&
          reportIsEditable &&
          !isF24 &&
          !item.parent_transaction_id &&
          [ScheduleIds.A, ScheduleIds.E].includes(item.transactionType.scheduleId),
        () => true,
      ),
      new TableAction(
        'Itemize',
        (item) => this.forceItemization(item, true, ctx.reloadTable),
        (item) =>
          item.itemized === false &&
          reportIsEditable &&
          !isF24 &&
          !item.parent_transaction_id &&
          ![ScheduleIds.C, ScheduleIds.D].includes(item.transactionType.scheduleId),
        () => true,
      ),
      new TableAction(
        'Unitemize',
        (item) => this.forceItemization(item, false, ctx.reloadTable),
        (item) =>
          item.itemized === true &&
          reportIsEditable &&
          !isF24 &&
          !item.parent_transaction_id &&
          ![ScheduleIds.C, ScheduleIds.D].includes(item.transactionType.scheduleId),
        () => true,
      ),
      new TableAction(
        'Receive loan repayment',
        (item) => this.createLoanRepaymentReceived(item, reportId),
        (item) => item.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_BY_COMMITTEE && reportIsEditable,
        () => true,
      ),
      new TableAction(
        'Review loan agreement',
        (item) => this.editLoanAgreement(item),
        (item) =>
          reportIsEditable &&
          item.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
          !!item.loan_agreement_id,
        () => true,
      ),
      new TableAction(
        'New loan agreement',
        (item) => this.createLoanAgreement(item, reportId),
        (item) =>
          reportIsEditable &&
          item.transaction_type_identifier === ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK &&
          isPulledForwardLoan(item) &&
          !item.loan_agreement_id,
        () => true,
      ),
      new TableAction(
        'Make loan repayment',
        (item) => this.createLoanRepaymentMade(item, reportId),
        (item) =>
          [
            ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
            ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
          ].includes(item.transaction_type_identifier as ScheduleCTransactionTypes) && reportIsEditable,
        () => true,
      ),
      new TableAction(
        'Report debt repayment',
        (item) => this.createDebtRepaymentMade(item, reportId),
        (item) =>
          item.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE && reportIsEditable,
        () => true,
      ),
      new TableAction(
        'Report debt repayment',
        (item) => this.createDebtRepaymentReceived(item, reportId),
        (item) =>
          item.transaction_type_identifier === ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE && reportIsEditable,
        () => true,
      ),
    ];

    // Reattribution / Redesignation (Only applicable if assigned to a report)
    if (!ctx.isUnassigned && ctx.report) {
      actions.push(
        new TableAction(
          'Reattribute',
          (item) => this.createReattribution(item, reportId, reportIsEditable),
          (item) => ReattRedesUtils.canReattribute(item),
          () => true,
        ),
        new TableAction(
          'Redesignate',
          (item) => this.createRedesignation(item, reportId, reportIsEditable),
          (item) =>
            item.transactionType.scheduleId === ScheduleIds.B &&
            item.transactionType.hasElectionInformation(ctx.report!.report_type) &&
            !item.transactionType.negativeAmountValueOnly &&
            !item.parent_transaction_id &&
            !ReattRedesUtils.isReattRedes(item, [
              ReattRedesTypes.REDESIGNATION_FROM,
              ReattRedesTypes.REDESIGNATION_TO,
            ]) &&
            !ReattRedesUtils.isAtAmountLimit(item),
          () => true,
        ),
      );
    }

    // Form 24 Action (Disbursements only)
    if (ctx.category === 'disbursements' && !ctx.isUnassigned && ctx.onRequestF24Selection) {
      actions.push(
        new TableAction(
          'Add to Form24 Report',
          ctx.onRequestF24Selection,
          (item) =>
            ctx.report?.report_type === ReportTypes.F3X &&
            item.report_ids?.length === 1 &&
            item.transactionType?.scheduleId === ScheduleIds.E,
          () => true,
        ),
      );
    }

    return actions;
  }

  private editItem(item: TransactionListRecord, reportId: string): Promise<boolean> {
    return this.router.navigateByUrl(`/reports/transactions/report/${reportId}/list/${item.id}`);
  }

  private async editLoanAgreement(transaction: TransactionListRecord): Promise<boolean> {
    if (transaction.loan_agreement_id) {
      return this.router.navigate([`${transaction.loan_agreement_id}`], { relativeTo: this.activatedRoute });
    }
    return false;
  }

  private createLoanAgreement(transaction: TransactionListRecord, reportId: string): Promise<boolean> {
    return this.router.navigateByUrl(
      `/reports/transactions/report/${reportId}/list/${transaction.id}/create-sub-transaction/${ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT}`,
    );
  }

  private async forceUnaggregation(
    transaction: TransactionListRecord,
    unaggregated: boolean,
    reloadTable: () => Promise<void>,
  ) {
    transaction.force_unaggregated = unaggregated;
    if (this.transactionService.unaggregate) {
      try {
        await this.transactionService.unaggregate(transaction, unaggregated);
        await reloadTable();
      } catch (error) {
        console.error('Error updating item:', error);
      }
    }
  }

  private forceItemization(transaction: TransactionListRecord, itemized: boolean, reloadTable: () => Promise<void>) {
    this.confirmationService.confirm({
      message:
        'Changing the itemization status of this transaction will affect its associated transactions (such as memos).',
      header: 'Heads up!',
      accept: async () => {
        transaction.force_itemized = itemized;
        if (this.transactionService.itemize) {
          await this.transactionService.itemize(transaction, itemized);
          await reloadTable();
        }
      },
    });
  }

  private async createLoanRepaymentReceived(transaction: TransactionListRecord, reportId: string): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${reportId}/create/${ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED}?loan=${transaction.id}`,
    );
  }

  private async createDebtRepaymentReceived(transaction: TransactionListRecord, reportId: string): Promise<void> {
    await this.router.navigateByUrl(`/reports/transactions/report/${reportId}/select/receipt?debt=${transaction.id}`);
  }

  private async createLoanRepaymentMade(transaction: TransactionListRecord, reportId: string): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${reportId}/create/${ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE}?loan=${transaction.id}`,
    );
  }

  private async createDebtRepaymentMade(transaction: TransactionListRecord, reportId: string): Promise<void> {
    await this.router.navigateByUrl(
      `/reports/transactions/report/${reportId}/select/disbursement?debt=${transaction.id}`,
    );
  }

  private async createReattribution(
    transaction: TransactionListRecord,
    reportId: string,
    reportIsEditable: boolean,
  ): Promise<void> {
    if (reportIsEditable) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${reportId}/create/${transaction.transaction_type_identifier}?reattribution=${transaction.id}`,
      );
    } else {
      this.reatRedesStore.setTransaction(transaction, ReattRedesTypes.REATTRIBUTED);
    }
  }

  private async createRedesignation(
    transaction: TransactionListRecord,
    reportId: string,
    reportIsEditable: boolean,
  ): Promise<void> {
    if (reportIsEditable) {
      await this.router.navigateByUrl(
        `/reports/transactions/report/${reportId}/create/${transaction.transaction_type_identifier}?redesignation=${transaction.id}`,
      );
    } else {
      this.reatRedesStore.setTransaction(transaction, ReattRedesTypes.REDESIGNATED);
    }
  }

  private cloneItem(transaction: TransactionListRecord, reportId: string) {
    this.router
      .navigateByUrl(
        `/reports/transactions/report/${reportId}/create/${transaction.transaction_type_identifier}?clone=${transaction.id}`,
      )
      .catch((error) => {
        console.error(`Error cloning transaction ${transaction.id} of report ${reportId}:`, error);
        this.messageService.add({
          severity: 'error',
          summary: 'Unable to clone transaction',
          detail: 'The selected transaction could not be opened for cloning.',
          life: 3000,
        });
      });
  }
}

@Injectable()
export class UnassignedTransactionActionsFactory extends BaseTransactionActionsFactory {
  buildActions(ctx: ActionContext): TableAction<TransactionListRecord>[] {
    return [
      new TableAction(
        'View',
        (item) => this.router.navigateByUrl(`/transactions/list/${item.id}`),
        () => true,
        () => true,
      ),
      new TableAction(
        'Delete',
        (item) => ctx.deleteItem(item),
        (item) => this.canDelete(item),
        () => true,
      ),
    ];
  }
}
