import { plainToInstance, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';
import { ReattRedesTypes } from '../utils/reatt-redes/reatt-redes.utils';
import { RedesignationToUtils } from '../utils/reatt-redes/redesignation-to.utils';
import { RedesignationFromUtils } from '../utils/reatt-redes/redesignation-from.utils';
import { RedesignatedUtils } from '../utils/reatt-redes/redesignated.utils';

export class SchBTransaction extends Transaction {
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
  reattribution_redesignation_tag: string | undefined;
  reatt_redes_total?: number; // Amount of total money that has been redesignated for a transaction.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchBTransaction {
    let transaction = plainToInstance(SchBTransaction, json);
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

    switch (transaction.reattribution_redesignation_tag) {
      case ReattRedesTypes.REDESIGNATED: {
        transaction = RedesignatedUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REDESIGNATION_TO: {
        transaction = RedesignationToUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REDESIGNATION_FROM: {
        transaction = RedesignationFromUtils.overlayTransactionProperties(transaction);
        break;
      }
    }
    if (depth > 0 && transaction.reatt_redes) {
      transaction.reatt_redes = getFromJSON(transaction.reatt_redes, depth - 1);
    }

    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return [
      'back_reference_tran_id_number',
      'back_reference_sched_name',
      //'beneficiary_committee_name',
      ...super.getFieldsNotToValidate(),
    ];
  }
}

export enum ScheduleBTransactionTypes {
  IN_KIND_OUT = 'IN_KIND_OUT',
  IN_KIND_CONTRIBUTION_TO_CANDIDATE = 'IN_KIND_CONTRIBUTION_TO_CANDIDATE',
  IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE = 'IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE',
  BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT = 'BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT',
  OPERATING_EXPENDITURE = 'OPERATING_EXPENDITURE',
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT = 'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT',
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO = 'OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO',
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT = 'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT',
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO = 'OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO',
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL = 'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL',
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO = 'OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO',
  OPERATING_EXPENDITURE_VOID = 'OPERATING_EXPENDITURE_VOID',
  TRANSFER_TO_AFFILIATES = 'TRANSFER_TO_AFFILIATES',
  CONTRIBUTION_TO_CANDIDATE = 'CONTRIBUTION_TO_CANDIDATE',
  CONTRIBUTION_TO_CANDIDATE_VOID = 'CONTRIBUTION_TO_CANDIDATE_VOID',
  CONTRIBUTION_TO_OTHER_COMMITTEE = 'CONTRIBUTION_TO_OTHER_COMMITTEE',
  CONTRIBUTION_TO_OTHER_COMMITTEE_VOID = 'CONTRIBUTION_TO_OTHER_COMMITTEE_VOID',
  INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT = 'INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT',
  INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT = 'INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT',
  INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT = 'INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT',
  INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT = 'INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT',
  OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT = 'OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT',
  OTHER_DISBURSEMENT = 'OTHER_DISBURSEMENT',
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT = 'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT',
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO = 'OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO',
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT = 'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT',
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO = 'OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO',
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL = 'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL',
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO = 'OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO',
  OTHER_DISBURSEMENT_VOID = 'OTHER_DISBURSEMENT_VOID',
  NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT = 'NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT',
  NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT = 'NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT',
  NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO = 'NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO',
  NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT = 'NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT',
  NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO = 'NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO',
  NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL = 'NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL',
  NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO = 'NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO',
  NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT = 'NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT',
  RECOUNT_ACCOUNT_DISBURSEMENT = 'RECOUNT_ACCOUNT_DISBURSEMENT',
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT = 'NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT',
  NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT = 'NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT',
  TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT = 'TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT',
  TRIBAL_REFUND_NP_CONVENTION_ACCOUNT = 'TRIBAL_REFUND_NP_CONVENTION_ACCOUNT',
  TRIBAL_REFUND_NP_RECOUNT_ACCOUNT = 'TRIBAL_REFUND_NP_RECOUNT_ACCOUNT',
  REFUND_INDIVIDUAL_CONTRIBUTION = 'REFUND_INDIVIDUAL_CONTRIBUTION',
  REFUND_INDIVIDUAL_CONTRIBUTION_VOID = 'REFUND_INDIVIDUAL_CONTRIBUTION_VOID',
  REFUND_PARTY_CONTRIBUTION = 'REFUND_PARTY_CONTRIBUTION',
  REFUND_PARTY_CONTRIBUTION_VOID = 'REFUND_PARTY_CONTRIBUTION_VOID',
  REFUND_PAC_CONTRIBUTION = 'REFUND_PAC_CONTRIBUTION',
  REFUND_PAC_CONTRIBUTION_VOID = 'REFUND_PAC_CONTRIBUTION_VOID',
  REFUND_UNREGISTERED_CONTRIBUTION = 'REFUND_UNREGISTERED_CONTRIBUTION',
  REFUND_UNREGISTERED_CONTRIBUTION_VOID = 'REFUND_UNREGISTERED_CONTRIBUTION_VOID',
  FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT = 'FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT',
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT = 'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT',
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO = 'FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO',
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT = 'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT',
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO = 'FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO',
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL = 'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL',
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO = 'FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO',
  FEDERAL_ELECTION_ACTIVITY_VOID = 'FEDERAL_ELECTION_ACTIVITY_VOID',
  OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT = 'OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT',
  OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT = 'OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT',
  OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT = 'OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT',
  PARTY_IN_KIND_OUT = 'PARTY_IN_KIND_OUT',
  IN_KIND_TRANSFER_OUT = 'IN_KIND_TRANSFER_OUT',
  IN_KIND_TRANSFER_FEA_OUT = 'IN_KIND_TRANSFER_FEA_OUT',
  PAC_IN_KIND_OUT = 'PAC_IN_KIND_OUT',
  PAC_CONDUIT_EARMARK_OUT = 'PAC_CONDUIT_EARMARK_OUT',
  PAC_CONDUIT_EARMARK_OUT_DEPOSITED = 'PAC_CONDUIT_EARMARK_OUT_DEPOSITED',
  PAC_CONDUIT_EARMARK_OUT_UNDEPOSITED = 'PAC_CONDUIT_EARMARK_OUT_UNDEPOSITED',
  CONDUIT_EARMARK_OUT = 'CONDUIT_EARMARK_OUT',
  CONDUIT_EARMARK_OUT_DEPOSITED = 'CONDUIT_EARMARK_OUT_DEPOSITED',
  CONDUIT_EARMARK_OUT_UNDEPOSITED = 'CONDUIT_EARMARK_OUT_UNDEPOSITED',
  LOAN_MADE = 'LOAN_MADE',
  LOAN_REPAYMENT_MADE = 'LOAN_REPAYMENT_MADE',
}

export const ScheduleBTransactionTypeLabels: LabelList = [
  [ScheduleBTransactionTypes.IN_KIND_OUT, 'In-kind Out'],
  [ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE, 'In-kind Contribution to Candidate'],
  [ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE, 'In-kind Contribution to Other Committee'],
  [
    ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
    'Business/Labor Organization Refund - Non-contribution Account',
  ],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE, 'Operating Expenditure'],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
    'Credit Card Payment for Operating Expenditure',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO,
    'Credit Card Memo for Operating Expenditure',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
    'Staff Reimbursement for Operating Expenditure',
  ],
  [
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO,
    'Staff Reimbursement Memo for Operating Expenditure',
  ],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL, 'Payment to Payroll for Operating Expenditure'],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo for Operating Expenditure'],
  [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID, 'Void of Operating Expenditure'],
  [ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES, 'Transfers to Affiliates/Other Committees'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE, 'Contribution to Candidate'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID, 'Void of Contribution to Candidate'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE, 'Contribution to Other Committee'],
  [ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID, 'Void of Contribution to Other Committee'],
  [
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
    'Individual Refund - Non-contribution Account',
  ],
  [
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    'Individual Refund - National Party Headquarters Buildings Account',
  ],
  [
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
    'Individual Refund - National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
    'Individual Refund - National Party Recount/Legal Proceedings Account',
  ],
  [
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
    'Other Committee Refund - Non-contribution Account',
  ],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT, 'Other Disbursement'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT, 'Credit Card Payment for Other Disbursement'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO, 'Credit Card Memo for Other Disbursement'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT, 'Staff Reimbursement for Other Disbursement'],
  [
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO,
    'Staff Reimbursement Memo for Other Disbursement',
  ],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL, 'Payment to Payroll for Other Disbursement'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO, 'Payroll Memo for Other Disbursement'],
  [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID, 'Void of Other Disbursement'],
  [ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT, 'Non-contribution Account Disbursement'],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
    'Non-contribution Account Credit Card Payment',
  ],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO,
    'Non-contribution Account Credit Card Payment Memo',
  ],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
    'Non-contribution Account Staff Reimbursement',
  ],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO,
    'Non-contribution Account Staff Reimbursement Memo',
  ],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
    'Non-contribution Account Payment to Payroll',
  ],
  [
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO,
    'Non-contribution Account Payment to Payroll Memo',
  ],
  [
    ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
    'National Party Recount/Legal Proceedings Account Disbursement',
  ],
  [ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT, 'Recount Account Disbursement'],
  [
    ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
    'National Party Headquarters Buildings Account Disbursement',
  ],
  [
    ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
    'National Party Pres. Nominating Convention Account Disbursement',
  ],
  [
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    'Tribal Refund - National Party Headquarters Buildings Account',
  ],
  [
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
    'Tribal Refund - National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
    'Tribal Refund - National Party Recount/Legal Proceedings Account',
  ],
  [ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION, 'Refund of Individual Contribution'],
  [ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID, 'Refund of Individual Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION, 'Refund of Party Contribution'],
  [ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID, 'Refund of Party Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION, 'Refund of PAC Contribution'],
  [ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID, 'Refund of PAC Contribution - Void'],
  [ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION, 'Refund of Unregistered Receipt from Person'],
  [
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
    'Refund of Unregistered Receipt from Person - Void',
  ],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT, '100% Federal Election Activity Payment'],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
    'Credit Card Payment for 100% Federal Election Activity',
  ],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO,
    'Credit Card Memo for 100% Federal Election Activity',
  ],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
    'Staff Reimbursement for 100% Federal Election Activity',
  ],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO,
    'Staff Reimbursement Memo for 100% Federal Election Activity',
  ],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    'Payment to Payroll for 100% Federal Election Activity',
  ],
  [
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO,
    'Payroll Memo for 100% Federal Election Activity',
  ],
  [ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID, 'Void of 100% Federal Election Activity Payment'],
  [
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
    'Other Committee Refund - National Party Headquarters Buildings Account',
  ],
  [
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
    'Other Committee Refund - National Party Pres. Nominating Convention Account',
  ],
  [
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
    'Other Committee Refund - National Party Recount/Legal Proceedings Account',
  ],
  [ScheduleBTransactionTypes.PARTY_IN_KIND_OUT, 'Party In-kind Out'],
  [ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT, 'In-kind Transfer Out'],
  [ScheduleBTransactionTypes.IN_KIND_TRANSFER_FEA_OUT, 'In-kind Transfer Federal Election Activity Out'],
  [ScheduleBTransactionTypes.PAC_IN_KIND_OUT, 'PAC In-kind Out'],
  [ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT, 'PAC Conduit Earmark Out'],
  [ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT_DEPOSITED, 'PAC Conduit Earmark Out (Deposited)'],
  [ScheduleBTransactionTypes.PAC_CONDUIT_EARMARK_OUT_UNDEPOSITED, 'PAC Conduit Earmark Out (Undeposited)'],
  [ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT, 'Conduit Earmark Out'],
  [ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_DEPOSITED, 'Conduit Earmark Out (Deposited)'],
  [ScheduleBTransactionTypes.CONDUIT_EARMARK_OUT_UNDEPOSITED, 'Conduit Earmark Out (Undeposited)'],
  [ScheduleBTransactionTypes.LOAN_MADE, 'Loan Made'],
  [ScheduleBTransactionTypes.LOAN_REPAYMENT_MADE, 'Loan Repayment Made'],
];
