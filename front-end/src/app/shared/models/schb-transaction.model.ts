import { plainToClass, Transform } from 'class-transformer';
import { Transaction, AggregationGroups } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { TransactionTypeUtils } from '../utils/transaction-type.utils';

export class SchBTransaction extends Transaction {
  back_reference_tran_id_number: string | undefined;
  back_reference_sched_name: string | undefined;
  entity_type: string | undefined;
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
  @Transform(BaseModel.dateTransform) expenditure_date: Date | undefined;
  expenditure_amount: number | undefined;
  aggregate_amount: number | undefined;
  aggregation_group: AggregationGroups | undefined;
  semi_annual_refunded_bundled_amt: number | undefined;
  expenditure_purpose_descrip: string | undefined;
  category_code: string | undefined;
  beneficiary_committee_fec_id: string | undefined;
  beneficiary_committee_name: string | undefined;
  beneficiary_candidate_fec_id: string | undefined;
  beneficiary_candidate_last_name: string | undefined;
  beneficiary_candidate_first_name: string | undefined;
  beneficiary_candidate_middle_name: string | undefined;
  beneficiary_candidate_prefix: string | undefined;
  beneficiary_candidate_suffix: string | undefined;
  beneficiary_candidate_office: string | undefined;
  beneficiary_candidate_state: string | undefined;
  beneficiary_candidate_district: string | undefined;
  conduit_name: string | undefined;
  conduit_street_1: string | undefined;
  conduit_street_2: string | undefined;
  conduit_city: string | undefined;
  conduit_state: string | undefined;
  conduit_zip: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | undefined;

  override apiEndpoint = '/transactions/schedule-b';

  // prettier-ignore
  static fromJSON(json: any, depth = 2): SchBTransaction { // eslint-disable-line @typescript-eslint/no-explicit-any
    const transaction = plainToClass(SchBTransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = SchBTransaction.fromJSON(transaction.parent_transaction, depth-1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function(child) { return SchBTransaction.fromJSON(child, depth-1) });
    }
    return transaction;
  }

  getUpdatedParent(): Transaction {
    throw new Error('Tried to call updateParent on SchBTransaction and there is no update code');
  }
}

export enum ScheduleBTransactionGroups {
  OPERATING_EXPENDITURES = 'OPERATING EXPENDITURES',
  CONTRIBUTIONS_EXPENDITURES_TO_REGULAR_FILERS = 'CONTRIBUTIONS/EXPENDITURES TO REGULAR FILERS',
  OTHER_EXPENDITURES = 'OTHER EXPENDITURES',
  REFUND = 'REFUND',
  FEDERAL_ELECTION_ACTIVITY_EXPENDITURES = 'FEDERAL ELECTION ACTIVITY EXPENDITURES',
}

export type ScheduleBTransactionGroupsType =
  | ScheduleBTransactionGroups.OPERATING_EXPENDITURES
  | ScheduleBTransactionGroups.CONTRIBUTIONS_EXPENDITURES_TO_REGULAR_FILERS
  | ScheduleBTransactionGroups.OTHER_EXPENDITURES
  | ScheduleBTransactionGroups.REFUND
  | ScheduleBTransactionGroups.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES;

export enum ScheduleBTransactionTypes {
  OPERATING_EXPENDITURE = 'OPERATING_EXPENDITURE',
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT = 'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT',
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO = 'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO',
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT = 'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT',
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO = 'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO',
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL = 'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL',
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO = 'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO',
  OPERATING_EXPENDITURE_VOID = 'OPERATING_EXPENDITURE_VOID',
  TRANSFER_TO_AFFIILIATES = 'TRANSFER_TO_AFFIILIATES',
  CONTRIBUTION_TO_CANDIDATE = 'CONTRIBUTION_TO_CANDIDATE',
  CONTRIBUTION_TO_CANDIDATE_VOID = 'CONTRIBUTION_TO_CANDIDATE_VOID',
  CONTRIBUTION_TO_OTHER_COMMITTEE = 'CONTRIBUTION_TO_OTHER_COMMITTEE',
  CONTRIBUTION_TO_OTHER_COMMITTEE_VOID = 'CONTRIBUTION_TO_OTHER_COMMITTEE_VOID',
  OTHER_DISBURSEMENT = 'OTHER_DISBURSEMENT',
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT = 'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT',
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO = 'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO',
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT = 'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT',
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO = 'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO',
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL = 'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL',
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO = 'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO',
  OTHER_DISBURSEMENT_VOID = 'OTHER_DISBURSEMENT_VOID',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL',
  OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO = 'OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO',
  OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_ACCOUNT = 'OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_ACCOUNT',
  OTHER_DISBURSEMENT_RECOUNT = 'OTHER_DISBURSEMENT_RECOUNT',
  OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY = 'OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY',
  OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY = 'OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY',
  OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_INDIVIDUAL_REFUND = 'OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_INDIVIDUAL_REFUND',
  OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_REGULAR_REFUND = 'OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_REGULAR_REFUND',
  OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_TRIBAL_REFUND = 'OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_TRIBAL_REFUND',
  OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_INDIVIDUAL_REFUND = 'OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_INDIVIDUAL_REFUND',
  OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_REGULAR_REFUND = 'OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_REGULAR_REFUND',
  OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_TRIBAL_REFUND = 'OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_TRIBAL_REFUND',
  OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_INDIVIDUAL_REFUND = 'OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_INDIVIDUAL_REFUND',
  OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_REGULAR_REFUND = 'OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_REGULAR_REFUND',
  OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_TRIBAL_REFUND = 'OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_TRIBAL_REFUND',
  REFUND_CONTRIBUTION_INDIVIDUAL = 'REFUND_CONTRIBUTION_INDIVIDUAL',
  REFUND_CONTRIBUTION_INDIVIDUAL_VOID = 'REFUND_CONTRIBUTION_INDIVIDUAL_VOID',
  REFUND_CONTRIBUTION_PARTY = 'REFUND_CONTRIBUTION_PARTY',
  REFUND_CONTRIBUTION_PARTY_VOID = 'REFUND_CONTRIBUTION_PARTY_VOID',
  REFUND_CONTRIBUTION_PAC = 'REFUND_CONTRIBUTION_PAC',
  REFUND_CONTRIBUTION_PAC_VOID = 'REFUND_CONTRIBUTION_PAC_VOID',
  REFUND_CONTRIBUTION_NON_FEDERAL = 'REFUND_CONTRIBUTION_NON_FEDERAL',
  REFUND_CONTRIBUTION_NON_FEDERAL_VOID = 'REFUND_CONTRIBUTION_NON_FEDERAL_VOID',
  FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT = 'FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT',
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT = 'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT',
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO = 'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO',
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT = 'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT',
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO = 'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO',
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL = 'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL',
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO = 'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO',
  FEDERAL_ELECTION_ACTIVITY_VOID = 'FEDERAL_ELECTION_ACTIVITY_VOID',
}

export const ScheduleBTransactionTypeLabels: LabelList = [
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE, 'Operating Expenditure'],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
    'Credit Card Payment for Operating Expenditure',
  ],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO, 'Credit Card Corresponding Memo'],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
    'Staff Reimbursement for Operating Expenditure',
  ],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO, 'Reimbursement Corresponding Memo'],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL, 'Payment to Payroll for Operating Expenditure'],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo'],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID, 'Void of Operating Expenditure'],
  [ScheduleBTransactionTypes.TRANSFER_TO_AFFIILIATES, 'Transfers to Affiliates/Other Committees'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE, 'Contribution to Candidate'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID, 'Void of Contribution to Candidate'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE, 'Contribution to Other Committee'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID, 'Void of Contribution to Other Committee'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT, 'Other Disbursements'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT, 'Credit Card Payment for Other Disbursements'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO, 'Credit Card Corresponding Memo'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT, 'Staff Reimbursements for Other Disbursements'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO, 'Reimbursement Corresponding Memo'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL, 'Payment to Payroll for Other Disbursements'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID, 'Void of Other Disbursements'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT, 'Non-Contribution Account Disbursements'],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
    'Non-Contribution Account Credit Card Payment',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO,
    'Credit Card Corresponding Memo',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
    'Non-Contribution Account Staff Reimbursement',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO,
    'Reimbursement Corresponding Memo',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
    'Non-Contribution Account Payment to Payroll',
  ],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo'],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    'National Party Recount Account Disbursements',
  ],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_RECOUNT, 'Recount Disbursements'],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY,
    'Headquarters Account Operating Expense for National Party Expenses',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_OPERATING_EXPENSE_NATIONAL_PARTY,
    'Convention Account Operating Expense for National Party Expense',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_INDIVIDUAL_REFUND,
    'Headquarters Account - Individual Refund',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_REGULAR_REFUND,
    'Headquarters Account - Regular Filer Refund',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_HEADQUARTERS_ACCOUNT_TRIBAL_REFUND,
    'Headquarters Account - Tribal Refund',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_INDIVIDUAL_REFUND,
    'Convention Account - Individual Refund',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_REGULAR_REFUND,
    'Convention Account - Regular Filer Refund',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CONVENTION_ACCOUNT_TRIBAL_REFUND,
    'Convention Account - Tribal Refund',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_INDIVIDUAL_REFUND,
    'National Party Recount Account - Individual Refund',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_REGULAR_REFUND,
    'National Party Recount Account - Regular Filer Refund',
  ],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_NATIONAL_PARTY_RECOUNT_TRIBAL_REFUND,
    'National Party Recount Account - Tribal Refund',
  ],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_INDIVIDUAL, 'Refund of Individual Contribution'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_INDIVIDUAL_VOID, 'Refund of Individual Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PARTY, 'Refund of Party Contribution'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PARTY_VOID, 'Refund of Party Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PAC, 'Refund of PAC Contribution'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_PAC_VOID, 'Refund of PAC Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_NON_FEDERAL, 'Refund of Unregistered Contribution'],
  [ScheduleBTransactionTypes.REFUND_CONTRIBUTION_NON_FEDERAL_VOID, 'Refund of Unregistered Contribution - Void'],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT, '100% Federal Election Activity Payment'],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
    'Credit Card Payment for 100% Federal Election Activity',
  ],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO, 'Credit Card Corresponding Memo'],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
    'Staff Reimbursement for 100% Federal Election Activity',
  ],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO, 'Reimbursement Corresponding Memo'],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    'Payment to Payroll for 100% Federal Election Activity',
  ],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo'],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID, 'Void of 100% Federal Election Activity'],
];
