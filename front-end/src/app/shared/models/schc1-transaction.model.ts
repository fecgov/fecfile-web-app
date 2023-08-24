import { plainToClass, Transform } from 'class-transformer';
import { Transaction, AggregationGroups } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';

export class SchC1Transaction extends Transaction {
  lender_organization_name: string | undefined;
  lender_street_1: string | undefined;
  lender_street_2: string | undefined;
  lender_city: string | undefined;
  lender_state: string | undefined;
  lender_zip: string | undefined;
  loan_amount: number | undefined;
  loan_interest_rate: string | undefined;
  loan_interest_rate_field_setting: string | undefined;
  @Transform(BaseModel.dateTransform) loan_incurred_date: Date | undefined;
  loan_due_date: string | undefined;
  loan_due_date_field_setting: string | undefined;
  loan_restructured: boolean | undefined;
  @Transform(BaseModel.dateTransform) loan_originally_incurred_date: Date | undefined;
  credit_amount_this_draw: number | undefined;
  total_balance: number | undefined;
  others_liable: boolean | undefined;
  collateral: boolean | undefined;
  desc_collateral: string | undefined;
  collateral_value_amount: number | undefined;
  perfected_interest: boolean | undefined;
  future_income: boolean | undefined;
  desc_specification_of_the_above: string | undefined;
  estimated_value: number | undefined;
  @Transform(BaseModel.dateTransform) depository_account_established_date: Date | undefined;
  ind_name_account_location: string | undefined;
  account_street_1: string | undefined;
  account_street_2: string | undefined;
  account_city: string | undefined;
  account_state: string | undefined;
  account_zip: string | undefined;
  @Transform(BaseModel.dateTransform) dep_acct_auth_date_presidential: Date | undefined;
  basis_of_loan_description: string | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) treasurer_date_signed: Date | undefined;
  authorized_last_name: string | undefined;
  authorized_first_name: string | undefined;
  authorized_middle_name: string | undefined;
  authorized_prefix: string | undefined;
  authorized_suffix: string | undefined;
  authorized_title: string | undefined;
  @Transform(BaseModel.dateTransform) authorized_date_signed: Date | undefined;

  entity_type: string | undefined;
  aggregation_group: AggregationGroups | undefined;

  // The line_of_credit field is strictly to save front-end UI state and is not
  // part of the SchC1 spec
  line_of_credit: boolean | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchC1Transaction {
    const transaction = plainToClass(SchC1Transaction, json);
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
}

export enum ScheduleC1TransactionGroups {
  SCHEDULE_C1 = 'Schedule C-1',
}

export type ScheduleC1TransactionGroupsType = ScheduleC1TransactionGroups.SCHEDULE_C1;

export enum ScheduleC1TransactionTypes {
  C1_LOAN_AGREEMENT = 'C1_LOAN_AGREEMENT',
}

export const ScheduleC1TransactionTypeLabels: LabelList = [
  [ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT, 'Loan Agreement'],
];
