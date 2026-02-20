import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { TransactionService } from '../services/transaction.service';
import { TransactionListService } from '../services/transaction-list.service';
import type { Transaction } from '../models/transaction.model';
import type { ListRestResponse } from '../models/rest-api.model';
import type { SchATransaction } from '../models/scha-transaction.model';
import type { SchBTransaction } from '../models/schb-transaction.model';

@Injectable()
export class TransactionResolver {
  readonly service = inject(TransactionService);
  readonly listService = inject(TransactionListService);

  async resolve(route: ActivatedRouteSnapshot): Promise<Transaction | undefined> {
    const reportId = route.paramMap.get('reportId');
    const transactionTypeName = route.paramMap.get('transactionType');
    const transactionId = route.paramMap.get('transactionId');
    const parentTransactionId = route.paramMap.get('parentTransactionId');
    const debtId = route.queryParamMap.get('debt');
    const loanId = route.queryParamMap.get('loan');
    const reattributionId = route.queryParamMap.get('reattribution');
    const redesignationId = route.queryParamMap.get('redesignation');

    // Existing
    if (transactionId) {
      return this.resolveExistingTransactionFromId(transactionId);
    }
    // New
    if (reportId && transactionTypeName) {
      if (parentTransactionId) {
        const parentTransaction = await this.service.get(String(parentTransactionId));
        return this.getNewChildTransaction(parentTransaction, transactionTypeName);
      }
      if (debtId) {
        return this.resolveNewRepayment(debtId, transactionTypeName, 'debt');
      }
      if (loanId) {
        return this.resolveNewRepayment(loanId, transactionTypeName, 'loan');
      }
      if (reattributionId) {
        return this.resolveNewReattribution(reportId, reattributionId);
      }
      if (redesignationId) {
        return this.resolveNewRedesignation(reportId, redesignationId);
      }
      return this.resolveNewTransaction(reportId, transactionTypeName);
    }
    return undefined;
  }

  async resolveExistingTransactionFromId(transactionId: string): Promise<Transaction | undefined> {
    const transaction = await this.service.get(String(transactionId));
    const { ReattRedesUtils } = await import('../utils/reatt-redes/reatt-redes.utils');
    const { ReattRedesTypes } = await import('../utils/reatt-redes/reatt-redes.utils');
    if (
      transaction.transactionType?.isDependentChild(transaction) ||
      ReattRedesUtils.isReattRedes(transaction, [
        ReattRedesTypes.REATTRIBUTION_FROM,
        ReattRedesTypes.REDESIGNATION_FROM,
      ])
    ) {
      return this.resolveExistingTransactionFromId(transaction.parent_transaction_id ?? '');
    }
    return this.resolveExistingTransaction(transaction);
  }

  async resolveExistingTransaction(transaction: Transaction): Promise<Transaction | undefined> {
    const { ReattRedesUtils } = await import('../utils/reatt-redes/reatt-redes.utils');
    const { ReattRedesTypes } = await import('../utils/reatt-redes/reatt-redes.utils');
    const { MultipleEntryTransactionTypes } = await import('../utils/transaction-type.utils');
    if (
      (ReattRedesUtils.isReattRedes(transaction) &&
        !(
          ReattRedesUtils.isReattRedes(transaction, [ReattRedesTypes.REATTRIBUTED, ReattRedesTypes.REDESIGNATED]) &&
          transaction?.id
        )) ||
      (transaction.transaction_type_identifier &&
        MultipleEntryTransactionTypes().includes(transaction.transaction_type_identifier))
    ) {
      transaction.children = [];
      // tune page size
      const params = { parent: transaction.id ?? '', page_size: 100 };
      let pageNumber = 0;
      let page: ListRestResponse | null = null;
      do {
        page = await this.listService.getTableData(++pageNumber, '', params);
        if (!page) return transaction;
        for (const result of page.results) {
          const childTransaction = await this.service.get((result as Transaction).id ?? '');
          transaction.children?.push(childTransaction);
        }
      } while (page?.next);
      return transaction;
    }
    return transaction;
  }

  async resolveNewTransaction(reportId: string, transactionTypeName: string): Promise<Transaction | undefined> {
    const { TransactionTypeUtils } = await import('../utils/transaction-type.utils');
    const transactionType = await TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = await transactionType.getNewTransaction();
    transaction.report_ids = [String(reportId)];

    // If this transaction must be completed alongside other on-screen transactions, add them
    if (transactionType.dependentChildTransactionTypes) {
      const temp = transactionType.dependentChildTransactionTypes.map((type) =>
        this.getNewChildTransaction(transaction, type),
      );
      transaction.children = await Promise.all(transaction.children);
    }
    return transaction;
  }

  async resolveNewRepayment(toId: string, transactionTypeName: string, type: 'loan' | 'debt') {
    const to = await this.service.get(toId);
    const { TransactionTypeUtils } = await import('../utils/transaction-type.utils');
    const repaymentType = await TransactionTypeUtils.factory(transactionTypeName);
    const repayment = await repaymentType.getNewTransaction();
    if (type === 'loan') {
      repayment.loan = to;
      repayment.loan_id = to.id;
    }
    if (type === 'debt') {
      repayment.debt = to;
      repayment.debt_id = to.id;
    }
    repayment.report_ids = to.report_ids;
    return repayment;
  }

  async resolveNewReattribution(reportId: string, originatingId: string) {
    const originatingTransaction = await this.service.get(originatingId);
    const { TransactionTypeUtils } = await import('../utils/transaction-type.utils');
    const { ReattributedUtils } = await import('../utils/reatt-redes/reattributed.utils');
    const { ReattributionToUtils } = await import('../utils/reatt-redes/reattribution-to.utils');
    const { ReattributionFromUtils } = await import('../utils/reatt-redes/reattribution-from.utils');
    const reattributed = ReattributedUtils.overlayTransactionProperties(
      originatingTransaction as SchATransaction,
      reportId,
    );
    if (!reattributed.transaction_type_identifier) {
      throw Error('FECfile+: originating reattribution transaction type not found.');
    }
    let to = (await (
      await TransactionTypeUtils.factory(reattributed.transaction_type_identifier)
    ).getNewTransaction()) as SchATransaction;
    to = ReattributionToUtils.overlayTransactionProperties(to, reattributed, reportId);
    let from = (await (
      await TransactionTypeUtils.factory(reattributed.transaction_type_identifier)
    ).getNewTransaction()) as SchATransaction;
    from = ReattributionFromUtils.overlayTransactionProperties(from, reattributed, reportId);
    to.children = [from];
    return to;
  }

  async resolveNewRedesignation(reportId: string, originatingId: string) {
    const originatingTransaction = await this.service.get(originatingId);
    const { TransactionTypeUtils } = await import('../utils/transaction-type.utils');
    const { RedesignatedUtils } = await import('../utils/reatt-redes/redesignated.utils');
    const { RedesignationToUtils } = await import('../utils/reatt-redes/redesignation-to.utils');
    const { RedesignationFromUtils } = await import('../utils/reatt-redes/redesignation-from.utils');
    const redesignated = RedesignatedUtils.overlayTransactionProperties(
      originatingTransaction as SchBTransaction,
      reportId,
    );
    if (!redesignated.transaction_type_identifier) {
      throw Error('FECfile+: originating redesignation transaction type not found.');
    }
    let to = (await (
      await TransactionTypeUtils.factory(redesignated.transaction_type_identifier)
    ).getNewTransaction()) as SchBTransaction;
    to = RedesignationToUtils.overlayTransactionProperties(to, redesignated, reportId);
    let from = (await (
      await TransactionTypeUtils.factory(redesignated.transaction_type_identifier)
    ).getNewTransaction()) as SchBTransaction;
    from = RedesignationFromUtils.overlayTransactionProperties(from, redesignated, reportId);
    to.children = [from];
    return to;
  }

  /**
   * Build out a child transaction given the parent and the transaction type wanted
   * for the new child transaction.
   * @param parentTransaction
   * @param childTransactionTypeName
   * @returns {Transaction}
   */
  async getNewChildTransaction(parentTransaction: Transaction, childTransactionTypeName: string): Promise<Transaction> {
    const { TransactionTypeUtils } = await import('../utils/transaction-type.utils');
    const childTransactionType = await TransactionTypeUtils.factory(childTransactionTypeName);
    const childTransaction = await childTransactionType.getNewTransaction();
    childTransaction.parent_transaction = parentTransaction;
    childTransaction.parent_transaction_id = parentTransaction.id;
    childTransaction.report_ids = parentTransaction.report_ids;
    return childTransaction;
  }
}