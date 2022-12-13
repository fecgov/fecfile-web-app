import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve } from '@angular/router';
import { map, mergeMap, Observable, of } from 'rxjs';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { Transaction } from '../interfaces/transaction.interface';
import { Contact } from '../models/contact.model';
import { ContactService } from '../services/contact.service';
import { TransactionService } from '../services/transaction.service';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

@Injectable({
  providedIn: 'root',
})
export class TransactionTypeResolver implements Resolve<TransactionType | undefined> {
  constructor(private transactionService: TransactionService, private contactService: ContactService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TransactionType | undefined> {
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

  resolve_new_transaction(reportId: string, transactionTypeName: string): Observable<TransactionType | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.report_id = String(reportId);

    if (transactionType.childTransactionType) {
      transactionType.childTransactionType.transaction = transactionType.childTransactionType.getNewTransaction();
    }

    return of(transactionType);
  }

  resolve_new_child_transaction(
    parentTransactionId: string,
    transactionTypeName: string
  ): Observable<TransactionType | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
    return this.transactionService.get(String(parentTransactionId)).pipe(
      map((transaction: Transaction) => {
        transactionType.transaction = transactionType.getNewTransaction();

        transactionType.transaction.parent_transaction = transaction;
        transactionType.transaction.parent_transaction_object_id = String(parentTransactionId);
        transactionType.transaction.report_id = String(transaction.report_id);

        return transactionType;
      })
    );
  }

  resolve_existing_transaction(transactionId: string): Observable<TransactionType | undefined> {
    function buildTransactionType(transaction: Transaction): TransactionType | undefined {
      if (transaction.transaction_type_identifier && transaction.contact) {
        const transactionType: TransactionType = TransactionTypeUtils.factory(
          transaction.transaction_type_identifier
        ) as TransactionType;
        transactionType.transaction = transaction;
        transactionType.transaction.contact = Contact.fromJSON(transaction.contact);
        if (transaction.children?.length) {
          transactionType.childTransactionType = buildTransactionType(transaction.children[0]);
        }
        return transactionType;
      }
      return undefined;
    }

    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
        if (transaction.transaction_type_identifier && transaction.contact) {
          const transactionType = TransactionTypeUtils.factory(
            transaction.transaction_type_identifier
          ) as TransactionType;

          // Determine if we need to get the parent transaction as the
          // transaction type requested is a dependent transaction and cannot
          // be modified directly in a UI form. (e.g. EARMARK_MEMO)
          if (transactionType.isDependentChild) {
            // Get parent transaction to ensure we have a full list of children
            if (transaction?.parent_transaction?.id) {
              return this.transactionService.get(transaction.parent_transaction.id).pipe(
                map((transaction: Transaction) => {
                  return buildTransactionType(transaction);
                })
              );
            } else {
              throw new Error(
                `Transaction ${transaction.id} (${transaction.transaction_type_identifier}) is a dependent transaction type but does not have a parent transaction.`
              );
            }
          } else {
            return of(buildTransactionType(transaction));
          }
        }
        throw new Error(
          `Transaction type resolver can't find transaction and/or contact for transaction ID ${transactionId}`
        );
      })
    );
  }
}
