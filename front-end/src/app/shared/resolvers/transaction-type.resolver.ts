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

    if (parentTransactionId && transactionTypeName) {
      return this.resolve_child_transaction(parentTransactionId, transactionTypeName);
    }
    if (reportId && transactionTypeName) {
      return this.resolve_new_transaction(reportId, transactionTypeName);
    }
    if (transactionId) {
      return this.resolve_existing_transaction(transactionId);
    }
    return of(undefined);
  }

  resolve_new_transaction(reportId: string, transactionTypeName: string): Observable<TransactionType | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
    transactionType.transaction = transactionType.getNewTransaction();
    transactionType.transaction.report_id = Number(reportId);

    return of(transactionType);
  }

  resolve_child_transaction(
    parentTransactionId: string,
    transactionTypeName: string
  ): Observable<TransactionType | undefined> {
    const transactionType = TransactionTypeUtils.factory(transactionTypeName) as TransactionType;
    return this.transactionService.get(Number(parentTransactionId)).pipe(
      map((transaction: Transaction) => {
        transactionType.transaction = transactionType.getNewTransaction();

        transactionType.parent = transaction;
        transactionType.transaction.parent_transaction = Number(parentTransactionId);

        return transactionType;
      })
    );
  }

  resolve_existing_transaction(transactionId: string): Observable<TransactionType | undefined> {
    return this.transactionService.get(Number(transactionId)).pipe(
      map((transaction: Transaction) => {
        if (transaction.transaction_type_identifier) {
          const transactionType = TransactionTypeUtils.factory(
            transaction.transaction_type_identifier
          ) as TransactionType;
          transactionType.transaction = transaction;
          return transactionType;
        } else {
          return undefined;
        }
      })
    );
  }
}
