import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of, map } from 'rxjs';
import { Schedule } from '../interfaces/schedule.interface';
import { TransactionMeta } from '../interfaces/transaction-meta.interface';
import { TransactionService } from '../services/transaction.service';

// Import transaction models
import { SchATransaction } from '../models/scha-transaction.model';

// Import transaction schemas
import { schema as OFFSET_TO_OPEX } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPEX';

@Injectable({
  providedIn: 'root',
})
export class TransactionResolver implements Resolve<TransactionMeta | undefined> {
  private metaData: { [transaction_type_identifier: string]: TransactionMeta } = {
    OFFSET_TO_OPEX: {
      scheduleId: 'A',
      componentGroupId: 'B',
      schema: OFFSET_TO_OPEX,
      transaction: new SchATransaction(),
    },
  };

  constructor(private transactionService: TransactionService) {}

  resolve(route: ActivatedRouteSnapshot): Observable<TransactionMeta | undefined> {
    const reportId = route.paramMap.get('reportId');
    const transactionType = route.paramMap.get('transactionType');
    const transactionId = route.paramMap.get('transactionId');
    let tm: TransactionMeta;

    if (transactionType) {
      // This is a new transaction
      tm = this.metaData[transactionType];
      tm.transaction.report_id = Number(reportId);
      return of(tm);
    }
    if (transactionId) {
      // This is an edit of an existing transacion
      return this.transactionService.get(Number(transactionId)).pipe(
        map((transaction: Schedule) => {
          if (transaction.transaction_type_identifier) {
            tm = this.metaData[transaction.transaction_type_identifier];
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
