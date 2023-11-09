import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { EMPTY, expand, map, mergeMap, Observable, of, reduce } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { ListRestResponse } from '../models/rest-api.model';

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
          })
        );
      }
      if (debtId) {
        return this.resolveNewRepayment(debtId, transactionTypeName, 'debt');
      }
      if (loanId) {
        return this.resolveNewRepayment(loanId, transactionTypeName, 'loan');
      }
      return this.resolveNewTransaction(reportId, transactionTypeName);
    }
    return of(undefined);
  }

  resolveExistingTransactionFromId(transactionId: string): Observable<Transaction | undefined> {
    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
        if (transaction.transactionType?.isDependentChild(transaction)) {
          return this.resolveExistingTransactionFromId(transaction.parent_transaction_id ?? '');
        }
        return this.resolveExistingTransaction(transaction);
      })
    );
  }

  resolveExistingTransaction(transaction: Transaction): Observable<Transaction | undefined> {
    if (transaction.children) {
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
        }, transaction)
      );
    }
    return of(transaction);
  }

  resolveNewTransaction(reportId: string, transactionTypeName: string): Observable<Transaction | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = transactionType.getNewTransaction();
    transaction.report_id = String(reportId);

    // If this transaction must be completed alongside other on-screen transactions, add them
    if (transactionType.dependentChildTransactionTypes) {
      transaction.children = transactionType.dependentChildTransactionTypes.map((type) =>
        this.getNewChildTransaction(transaction, type)
      );
    }
    return of(transaction);
  }

  resolveNewChildTransaction(
    parentTransactionId: string,
    childTransactionTypeName: string
  ): Observable<Transaction | undefined> {
    return this.transactionService.get(String(parentTransactionId)).pipe(
      mergeMap((parentTransaction: Transaction) => {
        // If there is a grandparent transaction, then we need to retrieve it
        if (parentTransaction.parent_transaction_id) {
          return this.transactionService.get(parentTransaction.parent_transaction_id).pipe(
            map((grandparent) => {
              parentTransaction.parent_transaction = grandparent;
              return this.getNewChildTransaction(parentTransaction, childTransactionTypeName);
            })
          );
        }
        // Otherwise we just need to return an observable of the parent transaction
        return of(this.getNewChildTransaction(parentTransaction, childTransactionTypeName));
      })
    );
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
        repayment.report_id = to.report_id;
        return repayment;
      })
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
    childTransaction.report_id = parentTransaction.report_id;
    return childTransaction;
  }
}
