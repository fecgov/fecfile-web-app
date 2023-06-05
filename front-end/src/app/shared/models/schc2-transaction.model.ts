import { plainToClass } from 'class-transformer';
import { Transaction, AggregationGroups } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';
import { ScheduleCTransactionGroups } from './schc-transaction.model';

export class SchC2Transaction extends Transaction {
  guarantor_last_name: string | undefined;
  guarantor_first_name: string | undefined;
  guarantor_middle_name: string | undefined;
  guarantor_prefix: string | undefined;
  guarantor_suffix: string | undefined;
  guarantor_street_1: string | undefined;
  guarantor_street_2: string | undefined;
  guarantor_city: string | undefined;
  guarantor_state: string | undefined;
  guarantor_zip: string | undefined;
  guarantor_employer: string | undefined;
  guarantor_occupation: string | undefined;
  guaranteed_amount: number | undefined;

  entity_type: string | undefined;
  receipt_line_number: string | undefined;
  election_code: string | undefined;
  election_other_description: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  aggregation_group: AggregationGroups | undefined;

  override apiEndpoint = '/transactions/schedule-c2';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchC2Transaction {
    const transaction = plainToClass(SchC2Transaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = SchC2Transaction.fromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return SchC2Transaction.fromJSON(child, depth - 1);
      });
    }
    return transaction;
  }
}

export type ScheduleCTransactionGroupsType = ScheduleCTransactionGroups.SCHEDULE_C_AND_C1;

export enum ScheduleC2TransactionTypes {
  LOAN_GUARANTOR_INFORMATION = 'LOAN_GUARANTOR_INFORMATION',
}

export const ScheduleC2TransactionTypeLabels: LabelList = [
  [ScheduleC2TransactionTypes.LOAN_GUARANTOR_INFORMATION, 'Loan Guarantor Information'],
];
