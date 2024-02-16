import { plainToInstance, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { setMetaProperties } from '../utils/transaction-type.utils';

export class SchETransaction extends Transaction {
  receipt_line_number: string | undefined;
  aggregation_group: AggregationGroups | undefined;

  entity_type: string | undefined;
  filer_committee_id_number: string | undefined;
  transaction_id_number: string | undefined;
  payee_organization_name: string | undefined;
  payee_last_name: string | undefined;
  payee_first_name: string | undefined;
  payee_middle_name: string | undefined;
  payee_prefix: string | undefined;
  payee_suffix: string | undefined;

  payee_street_1: string | undefined;
  payee_street_2: string | undefined;
  payee_city: string | undefined;
  payee_state: string | undefined;
  payee_zip: string | undefined;

  election_code: string | undefined;
  election_other_description: string | undefined;
  @Transform(BaseModel.dateTransform) dissemination_date: Date | undefined;
  expenditure_amount: number | undefined;
  @Transform(BaseModel.dateTransform) disbursement_date: Date | undefined;
  calendar_ytd_per_election_office: number | undefined; // calculated field

  expenditure_purpose_descrip: string | undefined;
  category_code: string | undefined;

  payee_cmtte_fec_id_number: string | undefined;

  support_oppose_code: string | undefined;
  so_candidate_id_number: string | undefined;
  so_candidate_last_name: string | undefined;
  so_candidate_first_name: string | undefined;
  so_candidate_middle_name: string | undefined;
  so_candidate_prefix: string | undefined;
  so_candidate_suffix: string | undefined;
  so_candidate_office: string | undefined;
  so_candidate_district: string | undefined;
  so_candidate_state: string | undefined;

  completing_last_name: string | undefined;
  completing_first_name: string | undefined;
  completing_middle_name: string | undefined;
  completing_prefix: string | undefined;
  completing_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;

  memo_code: boolean | undefined;
  memo_text_description: string | undefined;

  // calendar_ytd_per_election_office is dynamically calculated on the back-end

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchETransaction {
    const transaction = plainToInstance(SchETransaction, json);
    setMetaProperties(transaction, depth);
    return transaction;
  }

  // and not saved in the database
  override getFieldsNotToValidate(): string[] {
    return [
      'back_reference_tran_id_number',
      'back_reference_sched_name',
      'calendar_ytd_per_election_office',
      ...super.getFieldsNotToValidate(),
    ];
  }

  override getFieldsNotToSave(): string[] {
    return ['calendar_ytd_per_election_office', ...super.getFieldsNotToSave()];
  }
}

export enum ScheduleETransactionGroups {
  INDEPENDENT_EXPENDITURES = 'INDEPENDENT EXPENDITURES',
}

export type ScheduleETransactionGroupsType = ScheduleETransactionGroups.INDEPENDENT_EXPENDITURES;

export enum ScheduleETransactionTypes {
  INDEPENDENT_EXPENDITURE = 'INDEPENDENT_EXPENDITURE',
  INDEPENDENT_EXPENDITURE_VOID = 'INDEPENDENT_EXPENDITURE_VOID',
  MULTISTATE_INDEPENDENT_EXPENDITURE = 'MULTISTATE_INDEPENDENT_EXPENDITURE',
  INDEPENDENT_EXPENDITURE_DEBT = 'INDEPENDENT_EXPENDITURE_DEBT',
  INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT = 'INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT',
  INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO = 'INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO',
  INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT = 'INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT',
  INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO = 'INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO',
  INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL = 'INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL',
  INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO = 'INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO',
}

export const ScheduleETransactionTypeLabels: LabelList = [
  [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE, 'Independent Expenditure'],
  [ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE, 'Multistate Independent Expenditure'],
  [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_DEBT, 'Debt for Independent Expenditure'],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
    'Credit Card Payment for Independent Expenditure',
  ],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO,
    'Credit Card Memo for Independent Expenditure',
  ],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
    'Staff Reimbursement for Independent Expenditure',
  ],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO,
    'Staff Reimbursement Memo for Independent Expenditure',
  ],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
    'Payment to Payroll for Independent Expenditure',
  ],
  [
    ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO,
    'Payroll Memo for Independent Expenditure',
  ],
  [ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID, 'Independent Expenditure - Void'],
];
