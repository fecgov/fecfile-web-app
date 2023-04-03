import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, Observable, of, mergeMap } from 'rxjs';
import { Transaction } from '../models/transaction.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolver implements Resolve<Transaction | undefined> {
  constructor(private transactionService: TransactionService, private contactService: ContactService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Transaction | undefined> {
    const reportId = route.paramMap.get('reportId');
    const transactionTypeName = route.paramMap.get('transactionType');
    const transactionId = route.paramMap.get('transactionId');
    const parentTransactionId = route.paramMap.get('parentTransactionId');

    if (transactionId) {
      return this.resolve_existing_transaction(transactionId);
    }
    if (parentTransactionId && transactionTypeName) {
      return this.resolve_new_child_transaction(parentTransactionId, transactionTypeName);
    }
    if (reportId && transactionTypeName) {
      return this.resolve_new_transaction(reportId, transactionTypeName);
    }
    return of(undefined);
  }

  resolve_new_transaction(reportId: string, transactionTypeName: string): Observable<Transaction | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName);
    const transaction: Transaction = transactionType.getNewTransaction();
    transaction.report_id = String(reportId);

    if (transactionType.dependentChildTransactionType) {
      transaction.children = [this.getNewChildTransaction(transaction, transactionType.dependentChildTransactionType)];
    }

    return of(transaction);
  }

  resolve_new_child_transaction(
    parentTransactionId: string,
    childTransactionTypeName: string
  ): Observable<Transaction | undefined> {
    return this.transactionService.get(String(parentTransactionId)).pipe(
      map((parentTransaction: Transaction) => {
        return this.getNewChildTransaction(parentTransaction, childTransactionTypeName);
      })
    );
  }

  resolve_existing_transaction(transactionId: string): Observable<Transaction | undefined> {
    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
        if (transaction.transaction_type_identifier && transaction.contact) {
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
            return of(transaction);
          }
        }
        throw new Error(
          `Fecfile: Transaction type resolver can't find transaction and/or contact for transaction ID ${transactionId}`
        );
      })
    );
  }

  private getNewChildTransaction(parentTransaction: Transaction, childTransactionTypeName: string): Transaction {
    const childTransactionType = TransactionTypeUtils.factory(childTransactionTypeName);
    const childTransaction = childTransactionType.getNewTransaction();
    childTransaction.parent_transaction = parentTransaction;
    childTransaction.parent_transaction_id = parentTransaction.id;
    childTransaction.report_id = parentTransaction.report_id;
    return childTransaction;
  }
}
