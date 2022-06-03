import { TransactionType } from '../interfaces/transaction-type.interface';
import { OFFSET_TO_OPEX } from '../models/transaction-types/OFFSET_TO_OPEX.model';
import { INDV_REC } from '../models/transaction-types/INDV_REC.model';

// prettier-ignore
const transactionTypeClasses: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  OFFSET_TO_OPEX,
  INDV_REC,
}

export class TransactionTypeUtils {
  static factory(transactionTypeIdentifier: string): TransactionType | null {
    if (
      transactionTypeClasses[transactionTypeIdentifier] === undefined ||
      transactionTypeClasses[transactionTypeIdentifier] === null
    ) {
      throw new Error(`Class transaction type of '${transactionTypeIdentifier}' is not found`);
    }
    return new transactionTypeClasses[transactionTypeIdentifier]();
  }
}
