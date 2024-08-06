import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, expand, map, mergeMap, Observable, of, reduce } from 'rxjs';
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
  constructor(public transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Transaction | undefined> {
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
        return this.transactionService.get(String(parentTransactionId)).pipe(
          mergeMap((parentTransaction: Transaction) => {
            return of(this.getNewChildTransaction(parentTransaction, transactionTypeName));
          }),
        );
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
    return of(undefined);
  }

  resolveExistingTransactionFromId(transactionId: string): Observable<Transaction | undefined> {
    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
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
      }),
    );
  }

  resolveExistingTransaction(transaction: Transaction): Observable<Transaction | undefined> {
    if (
      transaction.children &&
      transaction.transaction_type_identifier &&
      MultipleEntryTransactionTypes().includes(transaction.transaction_type_identifier)
    ) {
      transaction.children = [];
      // tune page size
      const params = { parent: transaction.id ?? '', page_size: 100 };
      return this.transactionService.getTableData(1, '', params).pipe(
        expand((page: ListRestResponse) => {
          return page.next ? this.transactionService.getTableData(page.pageNumber + 1, '', params) : EMPTY;
        }),
        reduce((transactionWithChildren: Transaction, page: ListRestResponse) => {
          transactionWithChildren.children?.push(...(page.results as Transaction[]));
          return transactionWithChildren;
        }, transaction),
      );
    }
    return of(transaction);
  }

  resolveNewTransaction(reportId: string, transactionTypeName: string): Observable<Transaction | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = transactionType.getNewTransaction();
    transaction.report_ids = [String(reportId)];

    // If this transaction must be completed alongside other on-screen transactions, add them
    if (transactionType.dependentChildTransactionTypes) {
      transaction.children = transactionType.dependentChildTransactionTypes.map((type) =>
        this.getNewChildTransaction(transaction, type),
      );
    }
    return of(transaction);
  }

  resolveNewRepayment(toId: string, transactionTypeName: string, type: 'loan' | 'debt') {
    return this.transactionService.get(toId).pipe(
      map((to: Transaction) => {
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
      }),
    );
  }

  resolveNewReattribution(reportId: string, originatingId: string) {
    return this.transactionService.get(originatingId).pipe(
      map((originatingTransaction: Transaction) => {
        const reattributed = ReattributedUtils.overlayTransactionProperties(
          originatingTransaction as SchATransaction,
          reportId,
        );
        if (!reattributed.transaction_type_identifier) {
          throw Error('Fecfile online: originating reattribution transaction type not found.');
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
      }),
    );
  }

  resolveNewRedesignation(reportId: string, originatingId: string) {
    return this.transactionService.get(originatingId).pipe(
      map((originatingTransaction: Transaction) => {
        const redesignated = RedesignatedUtils.overlayTransactionProperties(
          originatingTransaction as SchBTransaction,
          reportId,
        );
        if (!redesignated.transaction_type_identifier) {
          throw Error('Fecfile online: originating redesignation transaction type not found.');
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
      }),
    );
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
