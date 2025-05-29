import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils, MultipleEntryTransactionTypes } from '../utils/transaction-type.utils';
import { ListRestResponse } from '../models/rest-api.model';
import { SchATransaction } from '../models/scha-transaction.model';
import { SchBTransaction } from '../models/schb-transaction.model';
import { ReattRedesTypes, ReattRedesUtils } from '../utils/reatt-redes/reatt-redes.utils';
import { ReattributionToUtils } from '../utils/reatt-redes/reattribution-to.utils';
import { ReattributionFromUtils } from '../utils/reatt-redes/reattribution-from.utils';
import { RedesignationToUtils } from '../utils/reatt-redes/redesignation-to.utils';
import { RedesignationFromUtils } from '../utils/reatt-redes/redesignation-from.utils';
import { ReattributedUtils } from '../utils/reatt-redes/reattributed.utils';
import { RedesignatedUtils } from '../utils/reatt-redes/redesignated.utils';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolver {
  readonly transactionService = inject(TransactionService);

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
        const parentTransaction = await this.transactionService.get(String(parentTransactionId));
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
    const transaction = await this.transactionService.get(String(transactionId));
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
        page = await this.transactionService.getTableData(++pageNumber, '', params);
        transaction.children?.push(...(page.results as Transaction[]));
      } while (page?.next);
      return transaction;
    }
    return transaction;
  }

  async resolveNewTransaction(reportId: string, transactionTypeName: string): Promise<Transaction | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = transactionType.getNewTransaction();
    transaction.report_ids = [String(reportId)];

    // If this transaction must be completed alongside other on-screen transactions, add them
    if (transactionType.dependentChildTransactionTypes) {
      transaction.children = transactionType.dependentChildTransactionTypes.map((type) =>
        this.getNewChildTransaction(transaction, type),
      );
    }
    return transaction;
  }

  async resolveNewRepayment(toId: string, transactionTypeName: string, type: 'loan' | 'debt') {
    const to = await this.transactionService.get(toId);
    const repaymentType = TransactionTypeUtils.factory(transactionTypeName);
    const repayment = repaymentType.getNewTransaction();
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
    const originatingTransaction = await this.transactionService.get(originatingId);
    const reattributed = ReattributedUtils.overlayTransactionProperties(
      originatingTransaction as SchATransaction,
      reportId,
    );
    if (!reattributed.transaction_type_identifier) {
      throw Error('FECfile+ online: originating reattribution transaction type not found.');
    }
    let to = TransactionTypeUtils.factory(
      reattributed.transaction_type_identifier,
    ).getNewTransaction() as SchATransaction;
    to = ReattributionToUtils.overlayTransactionProperties(to, reattributed, reportId);
    let from = TransactionTypeUtils.factory(
      reattributed.transaction_type_identifier,
    ).getNewTransaction() as SchATransaction;
    from = ReattributionFromUtils.overlayTransactionProperties(from, reattributed, reportId);
    to.children = [from];
    return to;
  }

  async resolveNewRedesignation(reportId: string, originatingId: string) {
    const originatingTransaction = await this.transactionService.get(originatingId);
    const redesignated = RedesignatedUtils.overlayTransactionProperties(
      originatingTransaction as SchBTransaction,
      reportId,
    );
    if (!redesignated.transaction_type_identifier) {
      throw Error('FECfile+ online: originating redesignation transaction type not found.');
    }
    let to = TransactionTypeUtils.factory(
      redesignated.transaction_type_identifier,
    ).getNewTransaction() as SchBTransaction;
    to = RedesignationToUtils.overlayTransactionProperties(to, redesignated, reportId);
    let from = TransactionTypeUtils.factory(
      redesignated.transaction_type_identifier,
    ).getNewTransaction() as SchBTransaction;
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
  private getNewChildTransaction(parentTransaction: Transaction, childTransactionTypeName: string): Transaction {
    const childTransactionType = TransactionTypeUtils.factory(childTransactionTypeName);
    const childTransaction = childTransactionType.getNewTransaction();
    childTransaction.parent_transaction = parentTransaction;
    childTransaction.parent_transaction_id = parentTransaction.id;
    childTransaction.report_ids = parentTransaction.report_ids;
    return childTransaction;
  }
}
