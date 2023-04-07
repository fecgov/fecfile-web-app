import { plainToClass, Transform } from 'class-transformer';
import { Transaction, AggregationGroups } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

export class SchCTransaction extends Transaction {
  entity_type: string | undefined;
  receipt_line_number: string | undefined;
  lender_organization_name: string | undefined;
  lender_last_name: string | undefined;
  lender_first_name: string | undefined;
  lender_middle_name: string | undefined;
  lender_prefix: string | undefined;
  lender_suffix: string | undefined;
  lender_street_1: string | undefined;
  lender_street_2: string | undefined;
  lender_city: string | undefined;
  lender_state: string | undefined;
  lender_zip: string | undefined;
  election_code: string | undefined;
  election_other_description: string | undefined;
  loan_amount: number | undefined;
  @Transform(BaseModel.dateTransform) loan_payment_to_date: Date | undefined;
  loan_balance: number | undefined;
  @Transform(BaseModel.dateTransform) loan_incurred_date: Date | undefined;
  @Transform(BaseModel.dateTransform) loan_due_date: Date | undefined;
  loan_interest_rate: number | undefined;
  secured: boolean | undefined;
  personal_funds: boolean | undefined;
  lender_committee_id_number: string | undefined;
  lender_candidate_id_number: string | undefined;
  lender_candidate_last_name: string | undefined;
  lender_candidate_first_name: string | undefined;
  lender_candidate_middle_name: string | undefined;
  lender_candidate_prefix: string | undefined;
  lender_candidate_suffix: string | undefined;
  lender_candidate_office: string | undefined;
  lender_candidate_state: string | undefined;
  lender_candidate_district: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;

  aggregation_group: AggregationGroups | undefined;

  override apiEndpoint = '/transactions/schedule-c';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchCTransaction {
    const transaction = plainToClass(SchCTransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = SchCTransaction.fromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return SchCTransaction.fromJSON(child, depth - 1);
      });
    }
    return transaction;
  }
}

export enum ScheduleCTransactionGroups {
  SCHEDULE_C_AND_C1 = 'Schedule C and C-1',
}

export type ScheduleCTransactionGroupsType = ScheduleCTransactionGroups.SCHEDULE_C_AND_C1;

export enum ScheduleCTransactionTypes {
  LOANS_RECEIVED_FROM_INDIVIDUAL = 'LOANS_RECEIVED_FROM_INDIVIDUAL',
  LOANS_RECEIVED_FROM_BANK = 'LOANS_RECEIVED_FROM_BANK',
}

export const ScheduleCTransactionTypeLabels: LabelList = [
  [ScheduleCTransactionTypes.LOANS_RECEIVED_FROM_INDIVIDUAL, 'Loans Received from Individual'],
  [ScheduleCTransactionTypes.LOANS_RECEIVED_FROM_BANK, 'Loans Received from Bank'],
];
