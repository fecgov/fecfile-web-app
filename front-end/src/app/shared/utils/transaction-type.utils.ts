import { TransactionType } from '../interfaces/transaction-type.interface';
import { EARMARK_MEMO } from '../models/transaction-types/EARMARK_MEMO.model';
import { EARMARK_RECEIPT } from '../models/transaction-types/EARMARK_RECEIPT.model';
import { INDIVIDUAL_JF_TRANSFER_MEMO } from '../models/transaction-types/INDIVIDUAL_JF_TRANSFER_MEMO.model';
import { INDIVIDUAL_RECEIPT } from '../models/transaction-types/INDIVIDUAL_RECEIPT.model';
import { INDIVIDUAL_RECOUNT_RECEIPT } from '../models/transaction-types/INDIVIDUAL_RECOUNT_RECEIPT.model';
import { JOINT_FUNDRAISING_TRANSFER } from '../models/transaction-types/JOINT_FUNDRAISING_TRANSFER.model';
import { OFFSET_TO_OPERATING_EXPENDITURES } from '../models/transaction-types/OFFSET_TO_OPERATING_EXPENDITURES.model';
import { OTHER_RECEIPT } from '../models/transaction-types/OTHER_RECEIPT.model';
import { PAC_JF_TRANSFER_MEMO } from '../models/transaction-types/PAC_JF_TRANSFER_MEMO.model';
import { PAC_RECOUNT_RECEIPT } from '../models/transaction-types/PAC_RECOUNT_RECEIPT.model';
import { PAC_RECEIPT } from '../models/transaction-types/PAC_RECEIPT.model';
import { PARTY_JF_TRANSFER_MEMO } from '../models/transaction-types/PARTY_JF_TRANSFER_MEMO.model';
import { PARTY_RECEIPT } from '../models/transaction-types/PARTY_RECEIPT.model';
import { PARTY_RECOUNT_RECEIPT } from '../models/transaction-types/PARTY_RECOUNT_RECEIPT.model';
import { TRANSFER } from '../models/transaction-types/TRANSFER.model';
import { TRIBAL_JF_TRANSFER_MEMO } from '../models/transaction-types/TRIBAL_JF_TRANSFER_MEMO.model';
import { TRIBAL_RECEIPT } from '../models/transaction-types/TRIBAL_RECEIPT.model';
import { TRIBAL_RECOUNT_RECEIPT } from '../models/transaction-types/TRIBAL_RECOUNT_RECEIPT.model';
import { JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT } from '../models/transaction-types/JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT.model';

// prettier-ignore
const transactionTypeClasses: any = { // eslint-disable-line @typescript-eslint/no-explicit-any
  EARMARK_RECEIPT,
  EARMARK_MEMO,
  INDIVIDUAL_JF_TRANSFER_MEMO,
  INDIVIDUAL_RECEIPT,
  INDIVIDUAL_RECOUNT_RECEIPT,
  JOINT_FUNDRAISING_TRANSFER,
  OFFSET_TO_OPERATING_EXPENDITURES,
  OTHER_RECEIPT,
  PAC_JF_TRANSFER_MEMO,
  PAC_RECEIPT,
  PAC_RECOUNT_RECEIPT,
  PARTY_JF_TRANSFER_MEMO,
  PARTY_RECEIPT,
  PARTY_RECOUNT_RECEIPT,
  TRANSFER,
  TRIBAL_JF_TRANSFER_MEMO,
  TRIBAL_RECEIPT,
  TRIBAL_RECOUNT_RECEIPT,
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
}

export class TransactionTypeUtils {
  static factory(transactionTypeIdentifier: string): TransactionType | undefined {
    if (
      transactionTypeClasses[transactionTypeIdentifier] === undefined ||
      transactionTypeClasses[transactionTypeIdentifier] === null
    ) {
      throw new Error(`Class transaction type of '${transactionTypeIdentifier}' is not found`);
    }
    return new transactionTypeClasses[transactionTypeIdentifier]();
  }
}
