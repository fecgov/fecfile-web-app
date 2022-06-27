import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionType } from '../interfaces/transaction-type.interface';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { TransactionService } from '../services/transaction.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionTypeResolver implements Resolve<TransactionType | undefined> {
  constructor(private transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TransactionType | undefined> {
    const reportId = route.paramMap.get('reportId');
    const transactionTypeName = route.paramMap.get('transactionType');
    const transactionId = route.paramMap.get('transactionId');
    const parentTransactionId = route.paramMap.get('parentTransactionId');
    let transactionType: TransactionType;

    if (transactionTypeName) {
      // This is a new transaction
      transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
      transactionType.transaction = transactionType.getNewTransaction();
      transactionType.transaction.report_id = Number(reportId);
      transactionType.transaction.parent_transaction = Number(parentTransactionId);
      return of(transactionType);
    }
    if (transactionId) {
      // This is an edit of an existing transacion
      return this.transactionService.get(Number(transactionId)).pipe(
        map((transaction: Transaction) => {
          if (transaction.transaction_type_identifier) {
            transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier) as TransactionType;
            transactionType.transaction = transaction;
            return transactionType;
          } else {
            return undefined;
          }
        })
      );
    }
    return of(undefined);
  }
}
