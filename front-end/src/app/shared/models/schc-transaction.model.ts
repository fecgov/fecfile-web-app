import { plainToClass, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';

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
  loan_payment_to_date: number | undefined;
  loan_balance: number | undefined;
  @Transform(BaseModel.dateTransform) loan_incurred_date: Date | undefined;
  loan_due_date: string | undefined;
  loan_due_date_field_setting: string | undefined;
  loan_interest_rate: string | undefined;
  loan_interest_rate_field_setting: string | undefined;
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

  // loan_payment_to_date and loan_balance are dynamically calculated on the back-end

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchCTransaction {
    const transaction = plainToClass(SchCTransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = getFromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return getFromJSON(child, depth - 1);
      });
    }
    return transaction;
  }

  // and not saved in the database
  override getFieldsNotToValidate(): string[] {
    return ['loan_payment_to_date', 'loan_balance', ...super.getFieldsNotToValidate()];
  }

  override getFieldsNotToSave(): string[] {
    return ['loan_payment_to_date', 'loan_balance', ...super.getFieldsNotToSave()];
  }
}

export enum ScheduleCTransactionGroups {
  LOANS = 'LOANS',
}

export type ScheduleCTransactionGroupsType = ScheduleCTransactionGroups.LOANS;

export enum ScheduleCTransactionTypes {
  LOAN_RECEIVED_FROM_INDIVIDUAL = 'LOAN_RECEIVED_FROM_INDIVIDUAL',
  LOAN_RECEIVED_FROM_BANK = 'LOAN_RECEIVED_FROM_BANK',
  LOAN_BY_COMMITTEE = 'LOAN_BY_COMMITTEE',
}

export const ScheduleCTransactionTypeLabels: LabelList = [
  [ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL, 'Loan Received from Individual'],
  [ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK, 'Loan Received from Bank'],
  [ScheduleCTransactionTypes.LOAN_BY_COMMITTEE, 'Loan By Committee'],
];
