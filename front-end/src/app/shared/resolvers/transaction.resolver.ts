import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable, of, mergeMap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

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

    if (transactionId) {
      return this.resolveExistingTransaction(transactionId);
    }
    if (parentTransactionId && transactionTypeName) {
      return this.resolveNewChildTransaction(parentTransactionId, transactionTypeName);
    }
    if (reportId && transactionTypeName) {
      if (debtId) {
        return this.resolveNewDebtRepayment(debtId, transactionTypeName);
      }
      return this.resolveNewTransaction(reportId, transactionTypeName);
    }
    return of(undefined);
  }

  resolveNewTransaction(reportId: string, transactionTypeName: string): Observable<Transaction | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = transactionType.getNewTransaction();
    transaction.report_id = String(reportId);

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

  resolveNewDebtRepayment(debtId: string, transactionTypeName: string) {
    return this.transactionService.get(debtId).pipe(
      map((debt: Transaction) => {
        const repaymentType = TransactionTypeUtils.factory(transactionTypeName);
        const repayment = repaymentType.getNewTransaction();
        repayment.repayment_to = debt;
        repayment.repayment_to_id = debt.id;
        repayment.report_id = debt.report_id;
        return repayment;
      })
    );
  }

  resolveExistingTransaction(transactionId: string): Observable<Transaction | undefined> {
    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
        if (transaction.transaction_type_identifier && transaction.contact_1) {
          // Determine if we need to get the parent transaction as the
          // transaction type requested is a dependent transaction and cannot
          // be modified directly in a UI form. (e.g. EARMARK_MEMO)
          if (transaction.transactionType && transaction.transactionType.isDependentChild) {
            // Get parent transaction to ensure we have a full list of children
            if (transaction?.parent_transaction_id) {
              return this.transactionService.get(transaction.parent_transaction_id);
            } else {
              throw new Error(
                `Fecfile: Transaction ${transaction.id} (${transaction.transaction_type_identifier}) is a dependent transaction type but does not have a parent transaction.`
              );
            }
          } else {
            if (transaction?.parent_transaction_id) {
              return this.resolveExistingTransaction(transaction.parent_transaction_id).pipe(
                map((parent) => {
                  transaction.parent_transaction = parent;
                  return transaction;
                })
              );
            } else if (transaction?.repayment_to_id) {
              return this.resolveExistingTransaction(transaction.repayment_to_id).pipe(
                map((repayment_to) => {
                  transaction.repayment_to = repayment_to;
                  return transaction;
                })
              );
            }
            return of(transaction);
          }
        }
        throw new Error(
          `Fecfile: Transaction type resolver can't find transaction and/or contact for transaction ID ${transactionId}`
        );
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
