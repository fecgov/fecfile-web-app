import { inject, Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { ListRestResponse } from '../models/rest-api.model';
import { SchATransaction } from '../models/transaction/schedule-a/scha-transaction.model';
import { SchBTransaction } from '../models/transaction/schedule-b/schb-transaction.model';
import { Transaction } from '../models/transaction/transaction.model';
import { TransactionService } from '../services/transaction.service';
import { ReattRedesUtils } from '../utils/reatt-redes/reatt-redes.utils';
import { ReattributedUtils } from '../utils/reatt-redes/reattributed.utils';
import { ReattributionFromUtils } from '../utils/reatt-redes/reattribution-from.utils';
import { ReattributionToUtils } from '../utils/reatt-redes/reattribution-to.utils';
import { RedesignatedUtils } from '../utils/reatt-redes/redesignated.utils';
import { RedesignationFromUtils } from '../utils/reatt-redes/redesignation-from.utils';
import { RedesignationToUtils } from '../utils/reatt-redes/redesignation-to.utils';
import { buildClonedTransaction } from '../utils/transaction-clone.utils';
import { MultipleEntryTransactionTypes, TransactionTypeUtils } from '../utils/transaction-type.utils';
import { TransactionListService } from '../services/transaction-list.service';
import { Store } from '@ngrx/store';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { isTransactionTypeDisabledForReport } from '../utils/transaction-disable.utils';
import { ReattRedesTypes } from '../utils/reatt-redes/reatt-redes.types';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolver {
  readonly service = inject(TransactionService);
  readonly listService = inject(TransactionListService);
  readonly store = inject(Store);
  readonly report = this.store.selectSignal(selectActiveReport);

  async resolve(route: ActivatedRouteSnapshot): Promise<Transaction | undefined> {
    const transactionId = route.paramMap.get('transactionId');

    // Existing
    if (transactionId) {
      return this.resolveExistingTransactionFromId(transactionId);
    }

    const reportId = route.paramMap.get('reportId');
    const transactionTypeName = route.paramMap.get('transactionType');

    if (
      !reportId ||
      !transactionTypeName ||
      isTransactionTypeDisabledForReport(this.report().report_type, transactionTypeName)
    ) {
      return undefined;
    }

    return this.resolveNewTransactionFlow(route, reportId, transactionTypeName);
  }

  async resolveNewTransactionFlow(
    route: ActivatedRouteSnapshot,
    reportId: string,
    transactionTypeName: string,
  ): Promise<Transaction | undefined> {
    const parentTransactionId = route.paramMap.get('parentTransactionId');
    if (parentTransactionId) {
      const parentTransaction = await this.service.get(String(parentTransactionId));
      return this.getNewChildTransaction(parentTransaction, transactionTypeName);
    }

    const resolverMap: Record<string, (id: string) => Promise<Transaction | undefined>> = {
      debt: (id) => this.resolveNewRepayment(id, transactionTypeName, 'debt'),
      loan: (id) => this.resolveNewRepayment(id, transactionTypeName, 'loan'),
      clone: (id) => this.resolveNewClone(reportId, id),
      reattribution: (id) => this.resolveNewReattribution(reportId, id),
      redesignation: (id) => this.resolveNewRedesignation(reportId, id),
    };

    for (const [key, resolverFn] of Object.entries(resolverMap)) {
      const id = route.queryParamMap.get(key);
      if (id) return resolverFn(id);
    }

    return this.resolveNewTransaction(reportId, transactionTypeName);
  }

  async resolveExistingTransactionFromId(transactionId: string): Promise<Transaction | undefined> {
    const transaction = await this.service.get(String(transactionId));
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
      let page: ListRestResponse;
      do {
        page = await this.listService.getTableData(++pageNumber, '', params);
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
    if (isTransactionTypeDisabledForReport(this.report().report_type, transactionTypeName)) {
      return undefined;
    }

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
    const to = await this.service.get(toId);
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

  async resolveNewClone(reportId: string, cloneId: string) {
    const sourceTransaction = await this.service.get(cloneId);
    return buildClonedTransaction(sourceTransaction, reportId);
  }

  async resolveNewReattribution(reportId: string, originatingId: string) {
    const originatingTransaction = await this.service.get(originatingId);
    const reattributed = ReattributedUtils.overlayTransactionProperties(
      originatingTransaction as SchATransaction,
      reportId,
    );
    if (!reattributed.transaction_type_identifier) {
      throw new Error('FECfile+: originating reattribution transaction type not found.');
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
    const originatingTransaction = await this.service.get(originatingId);
    const redesignated = RedesignatedUtils.overlayTransactionProperties(
      originatingTransaction as SchBTransaction,
      reportId,
    );
    if (!redesignated.transaction_type_identifier) {
      throw new Error('FECfile+: originating redesignation transaction type not found.');
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
