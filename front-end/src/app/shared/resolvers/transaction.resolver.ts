import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { Transaction } from '../interfaces/transaction.interface';
import { TransactionUtils } from '../utils/transaction.utils';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';
import { TransactionService } from '../services/transaction.service';
import { SchATransaction } from '../models/scha-transaction.model';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolver implements Resolve<TransactionMeta | undefined> {
  constructor(private transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TransactionMeta | undefined> {
    const reportId = route.paramMap.get('reportId');
    const transactionType = route.paramMap.get('transactionType');
    const transactionId = route.paramMap.get('transactionId');
    let tm: TransactionMeta;

    if (transactionType) {
      // This is a new transaction
      tm = TransactionUtils.getMeta(transactionType);
      if (tm.scheduleId === 'A') {
        tm.transaction = new SchATransaction();
      }
      if (tm.transaction) {
        tm.transaction.form_type = tm.formType;
        tm.transaction.filer_committee_id_number = 'getFromStore';
        tm.transaction.transaction_type_identifier = transactionType.toUpperCase();
        tm.transaction.transaction_id = 'randomAN20';
        tm.transaction.report_id = Number(reportId);
      }
      return of(tm);
    }
    if (transactionId) {
      // This is an edit of an existing transacion
      return this.transactionService.get(Number(transactionId)).pipe(
        map((transaction: Transaction) => {
          if (transaction.transaction_type_identifier) {
            tm = TransactionUtils.getMeta(transaction.transaction_type_identifier);
            tm.transaction = transaction;
            return tm;
          } else {
            return undefined;
          }
        })
      );
    }
    return of(undefined);
  }
}
