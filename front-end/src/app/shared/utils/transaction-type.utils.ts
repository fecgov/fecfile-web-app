import { TransactionType } from '../interfaces/transaction-type.interface';
import { INDIVIDUAL_RECEIPT } from '../models/transaction-types/INDIVIDUAL_RECEIPT.model';
import { JOINT_FUNDRAISING_TRANSFER } from '../models/transaction-types/JOINT_FUNDRAISING_TRANSFER.model';
import { OFFSET_TO_OPERATING_EXPENDITURES } from '../models/transaction-types/OFFSET_TO_OPERATING_EXPENDITURES.model';
import { OTHER_RECEIPT } from '../models/transaction-types/OTHER_RECEIPT.model';
import { TRIBAL_RECEIPT } from '../models/transaction-types/TRIBAL_RECEIPT.model';
import { JF_TRANSFER_PAC_MEMO } from '../models/transaction-types/JF_TRANSFER_PAC_MEMO.model';
import { EARMARK_RECEIPT } from '../models/transaction-types/EARMARK_RECEIPT.model';

// prettier-ignore
const transactionTypeClasses: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  INDIVIDUAL_RECEIPT,
  JOINT_FUNDRAISING_TRANSFER,
  OFFSET_TO_OPERATING_EXPENDITURES,
  OTHER_RECEIPT,
  TRIBAL_RECEIPT,
  JF_TRANSFER_PAC_MEMO,
  EARMARK_RECEIPT,
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
