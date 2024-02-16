import { plainToInstance } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';

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
  aggregation_group: AggregationGroups | undefined;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchC2Transaction {
    const transaction = plainToInstance(SchC2Transaction, json);
    this.setMetaProperties(transaction, depth);
    return transaction;
  }
}

export enum ScheduleC2TransactionGroups {
  LOAN_GUARANTORS = 'LOAN GUARANTORS',
}

export type ScheduleC2TransactionGroupsType = ScheduleC2TransactionGroups.LOAN_GUARANTORS;

export enum ScheduleC2TransactionTypes {
  C2_LOAN_GUARANTOR = 'C2_LOAN_GUARANTOR',
}

export const ScheduleC2TransactionTypeLabels: LabelList = [
  [ScheduleC2TransactionTypes.C2_LOAN_GUARANTOR, 'Guarantors to loan source'],
];
