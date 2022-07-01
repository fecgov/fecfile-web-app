import { TransactionType } from '../interfaces/transaction-type.interface';
import { INDV_REC } from '../models/transaction-types/INDV_REC.model';
import { JF_TRAN } from '../models/transaction-types/JF_TRAN.model';
import { OFFSET_TO_OPEX } from '../models/transaction-types/OFFSET_TO_OPEX.model';
import { OTH_REC } from '../models/transaction-types/OTH_REC.model';
import { TRIB_REC } from '../models/transaction-types/TRIB_REC.model';
import { JF_TRAN_PAC_MEMO } from '../models/transaction-types/JF_TRAN_PAC_MEMO.model';

// prettier-ignore
const transactionTypeClasses: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  INDV_REC,
  JF_TRAN,
  OFFSET_TO_OPEX,
  OTH_REC,
  TRIB_REC,
  JF_TRAN_PAC_MEMO,
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
