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
      return this.resolve_child_transaction(parentTransactionId, transactionTypeName);
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

  resolve_child_transaction(
    parentTransactionId: string,
    transactionTypeName: string
  ): Observable<TransactionType | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
    return this.transactionService.get(String(parentTransactionId)).pipe(
      map((transaction: Transaction) => {
        transactionType.transaction = transactionType.getNewTransaction();

        transactionType.parentTransaction = transaction;
        transactionType.transaction.parent_transaction_id = String(parentTransactionId);
        transactionType.transaction.report_id = String(transaction.report_id);

        return transactionType;
      })
    );
  }

  resolve_existing_transaction(transactionId: string): Observable<TransactionType | undefined> {
    return this.transactionService.get(String(transactionId)).pipe(
      mergeMap((transaction: Transaction) => {
        if (transaction.transaction_type_identifier && transaction.contact_id) {
          const transactionType = TransactionTypeUtils.factory(
            transaction.transaction_type_identifier
          ) as TransactionType;
          transactionType.transaction = transaction;

          if (transactionType.childTransactionType) {
            transactionType.childTransactionType.transaction = undefined; // TODO: Need to populate this with what is coming back from the API, ideally it is sending a list of 2 txns
            transactionType.childTransactionType.parentTransaction = transaction;
          }

          return this.contactService.get(transaction.contact_id).pipe(
            map((contact: Contact) => {
              if (transactionType.transaction) {
                transactionType.transaction.contact = contact;
              }
              return transactionType;
            })
          );
        } else {
          return of(undefined);
        }
      })
    );
  }
}
