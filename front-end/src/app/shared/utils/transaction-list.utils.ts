import { plainToClass } from 'class-transformer';
import { TransactionListRecord } from '../models/transaction-list-record.model';
import { TransactionTypeUtils } from './transaction-type.utils';

export class TransactionListUtils {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static async fromJSON(json: any): Promise<TransactionListRecord> {
    const transactionListRecord = plainToClass(TransactionListRecord, json);
    if (transactionListRecord.transaction_type_identifier) {
      transactionListRecord.transactionType = await TransactionTypeUtils.factory(
        transactionListRecord.transaction_type_identifier,
      );
    }
    return transactionListRecord;
  }
}
