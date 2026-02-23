/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  TransactionTypes,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
  ScheduleFTransactionTypes,
  ScheduleCTransactionTypes,
} from '../models/type-enums';
import type { TransactionType } from '../models/transaction-type.model';

export class TransactionTypeUtils {
  static async factory(transactionTypeIdentifier: string): Promise<TransactionType> {
    const transactionType = await getTransactionTypeClass(transactionTypeIdentifier);
    if (!transactionType) {
      throw new Error(`FECfile+: Class transaction type of '${transactionTypeIdentifier}' is not found`);
    }
    return new transactionType();
  }
}

export async function getTransactionTypeClass(transactionTypeIdentifier: string): Promise<any> {
  const loader = TRANSACTION_TYPE_LOADERS[transactionTypeIdentifier];
  if (!loader) {
    console.error(`No loader found for: ${transactionTypeIdentifier}`);
    return null;
  }

  try {
    const module = await loader();
    return module[transactionTypeIdentifier];
  } catch (error) {
    console.error(`Failed to load transaction type: ${transactionTypeIdentifier}`, error);
    return null;
  }
}

const TRANSACTION_TYPE_LOADERS: Record<string, () => Promise<any>> = {
  // Schedule A
  BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT.model'),
  CONDUIT_EARMARK_RECEIPT: () => import('../models/transaction-types/CONDUIT_EARMARK_RECEIPT.model'),
  EARMARK_MEMO: () => import('../models/transaction-types/EARMARK_MEMO.model'),
  EARMARK_MEMO_CONVENTION_ACCOUNT: () => import('../models/transaction-types/EARMARK_MEMO_CONVENTION_ACCOUNT.model'),
  EARMARK_MEMO_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/EARMARK_MEMO_HEADQUARTERS_ACCOUNT.model'),
  EARMARK_MEMO_RECOUNT_ACCOUNT: () => import('../models/transaction-types/EARMARK_MEMO_RECOUNT_ACCOUNT.model'),
  EARMARK_RECEIPT: () => import('../models/transaction-types/EARMARK_RECEIPT.model'),
  EARMARK_RECEIPT_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/EARMARK_RECEIPT_CONVENTION_ACCOUNT.model'),
  EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/EARMARK_RECEIPT_HEADQUARTERS_ACCOUNT.model'),
  EARMARK_RECEIPT_RECOUNT_ACCOUNT: () => import('../models/transaction-types/EARMARK_RECEIPT_RECOUNT_ACCOUNT.model'),
  INDIVIDUAL_JF_TRANSFER_MEMO: () => import('../models/transaction-types/INDIVIDUAL_JF_TRANSFER_MEMO.model'),
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model'),
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model'),
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/INDIVIDUAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model'),
  INDIVIDUAL_RECEIPT: () => import('../models/transaction-types/INDIVIDUAL_RECEIPT.model'),
  INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT.model'),
  INDIVIDUAL_RECOUNT_RECEIPT: () => import('../models/transaction-types/INDIVIDUAL_RECOUNT_RECEIPT.model'),
  IN_KIND_RECEIPT: () => import('../models/transaction-types/IN_KIND_RECEIPT.model'),
  IN_KIND_TRANSFER: () => import('../models/transaction-types/IN_KIND_TRANSFER.model'),
  IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY: () =>
    import('../models/transaction-types/IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY.model'),
  JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  JOINT_FUNDRAISING_TRANSFER: () => import('../models/transaction-types/JOINT_FUNDRAISING_TRANSFER.model'),
  LOAN_RECEIVED_FROM_BANK_RECEIPT: () => import('../models/transaction-types/LOAN_RECEIVED_FROM_BANK_RECEIPT.model'),
  LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT: () =>
    import('../models/transaction-types/LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT.model'),
  LOAN_REPAYMENT_RECEIVED: () => import('../models/transaction-types/LOAN_REPAYMENT_RECEIVED.model'),
  OFFSET_TO_OPERATING_EXPENDITURES: () => import('../models/transaction-types/OFFSET_TO_OPERATING_EXPENDITURES.model'),
  OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/OTHER_COMMITTEE_NON_CONTRIBUTION_ACCOUNT.model'),
  OTHER_RECEIPT: () => import('../models/transaction-types/OTHER_RECEIPT.model'),
  PAC_CONDUIT_EARMARK: () => import('../models/transaction-types/PAC_CONDUIT_EARMARK.model'),
  PAC_EARMARK_MEMO: () => import('../models/transaction-types/PAC_EARMARK_MEMO.model'),
  PAC_EARMARK_RECEIPT: () => import('../models/transaction-types/PAC_EARMARK_RECEIPT.model'),
  PAC_IN_KIND_RECEIPT: () => import('../models/transaction-types/PAC_IN_KIND_RECEIPT.model'),
  PAC_JF_TRANSFER_MEMO: () => import('../models/transaction-types/PAC_JF_TRANSFER_MEMO.model'),
  PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model'),
  PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model'),
  PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PAC_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model'),
  PAC_RECEIPT: () => import('../models/transaction-types/PAC_RECEIPT.model'),
  PAC_RECOUNT_RECEIPT: () => import('../models/transaction-types/PAC_RECOUNT_RECEIPT.model'),
  PAC_RETURN: () => import('../models/transaction-types/PAC_RETURN.model'),
  PARTNERSHIP_ATTRIBUTION: () => import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION.model'),
  PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_ACCOUNT_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO.model'),
  PARTNERSHIP_JF_TRANSFER_MEMO: () => import('../models/transaction-types/PARTNERSHIP_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_RECEIPT: () => import('../models/transaction-types/PARTNERSHIP_RECEIPT.model'),
  PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT: () =>
    import('../models/transaction-types/PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT.model'),
  PARTY_IN_KIND_RECEIPT: () => import('../models/transaction-types/PARTY_IN_KIND_RECEIPT.model'),
  PARTY_JF_TRANSFER_MEMO: () => import('../models/transaction-types/PARTY_JF_TRANSFER_MEMO.model'),
  PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  PARTY_RECEIPT: () => import('../models/transaction-types/PARTY_RECEIPT.model'),
  PARTY_RECOUNT_RECEIPT: () => import('../models/transaction-types/PARTY_RECOUNT_RECEIPT.model'),
  PARTY_RETURN: () => import('../models/transaction-types/PARTY_RETURN.model'),
  RECEIPT_FROM_UNREGISTERED_ENTITY: () => import('../models/transaction-types/RECEIPT_FROM_UNREGISTERED_ENTITY.model'),
  RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN: () =>
    import('../models/transaction-types/RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN.model'),
  REFUND_TO_OTHER_POLITICAL_COMMITTEE: () =>
    import('../models/transaction-types/REFUND_TO_OTHER_POLITICAL_COMMITTEE.model'),
  RETURN_RECEIPT: () => import('../models/transaction-types/RETURN_RECEIPT.model'),
  TRANSFER: () => import('../models/transaction-types/TRANSFER.model'),
  TRIBAL_JF_TRANSFER_MEMO: () => import('../models/transaction-types/TRIBAL_JF_TRANSFER_MEMO.model'),
  TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT.model'),
  TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model'),
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT.model'),
  TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO.model'),
  TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT.model'),
  TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO.model'),
  TRIBAL_RECEIPT: () => import('../models/transaction-types/TRIBAL_RECEIPT.model'),
  TRIBAL_RECOUNT_RECEIPT: () => import('../models/transaction-types/TRIBAL_RECOUNT_RECEIPT.model'),

  // Schedule B
  BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT.model'),
  CONDUIT_EARMARK_OUT: () => import('../models/transaction-types/CONDUIT_EARMARK_OUT.model'),
  CONTRIBUTION_TO_CANDIDATE: () => import('../models/transaction-types/CONTRIBUTION_TO_CANDIDATE.model'),
  CONTRIBUTION_TO_CANDIDATE_VOID: () => import('../models/transaction-types/CONTRIBUTION_TO_CANDIDATE_VOID.model'),
  CONTRIBUTION_TO_OTHER_COMMITTEE: () => import('../models/transaction-types/CONTRIBUTION_TO_OTHER_COMMITTEE.model'),
  CONTRIBUTION_TO_OTHER_COMMITTEE_VOID: () =>
    import('../models/transaction-types/CONTRIBUTION_TO_OTHER_COMMITTEE_VOID.model'),
  FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT.model'),
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT.model'),
  FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT_MEMO.model'),
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL.model'),
  FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL_MEMO.model'),
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT.model'),
  FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO: () =>
    import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT_MEMO.model'),
  FEDERAL_ELECTION_ACTIVITY_VOID: () => import('../models/transaction-types/FEDERAL_ELECTION_ACTIVITY_VOID.model'),
  INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT.model'),
  INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT.model'),
  INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT.model'),
  INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT.model'),
  IN_KIND_CONTRIBUTION_TO_CANDIDATE: () =>
    import('../models/transaction-types/IN_KIND_CONTRIBUTION_TO_CANDIDATE.model'),
  IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE: () =>
    import('../models/transaction-types/IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE.model'),
  IN_KIND_OUT: () => import('../models/transaction-types/IN_KIND_OUT.model'),
  IN_KIND_TRANSFER_FEA_OUT: () => import('../models/transaction-types/IN_KIND_TRANSFER_FEA_OUT.model'),
  IN_KIND_TRANSFER_OUT: () => import('../models/transaction-types/IN_KIND_TRANSFER_OUT.model'),
  LOAN_MADE: () => import('../models/transaction-types/LOAN_MADE.model'),
  LOAN_REPAYMENT_MADE: () => import('../models/transaction-types/LOAN_REPAYMENT_MADE.model'),
  NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT: () =>
    import('../models/transaction-types/NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT.model'),
  NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT: () =>
    import('../models/transaction-types/NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT.model'),
  NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT: () =>
    import('../models/transaction-types/NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT.model'),
  NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT.model'),
  NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO.model'),
  NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT.model'),
  NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL.model'),
  NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO.model'),
  NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT.model'),
  NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO: () =>
    import('../models/transaction-types/NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO.model'),
  OPERATING_EXPENDITURE: () => import('../models/transaction-types/OPERATING_EXPENDITURE.model'),
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT.model'),
  OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO.model'),
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL.model'),
  OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO.model'),
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT.model'),
  OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO: () =>
    import('../models/transaction-types/OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO.model'),
  OPERATING_EXPENDITURE_VOID: () => import('../models/transaction-types/OPERATING_EXPENDITURE_VOID.model'),
  OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT: () =>
    import('../models/transaction-types/OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT.model'),
  OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT.model'),
  OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT.model'),
  OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT: () =>
    import('../models/transaction-types/OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT.model'),
  OTHER_DISBURSEMENT: () => import('../models/transaction-types/OTHER_DISBURSEMENT.model'),
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT.model'),
  OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT_MEMO.model'),
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL.model'),
  OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO.model'),
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT.model'),
  OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO: () =>
    import('../models/transaction-types/OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT_MEMO.model'),
  OTHER_DISBURSEMENT_VOID: () => import('../models/transaction-types/OTHER_DISBURSEMENT_VOID.model'),
  PAC_CONDUIT_EARMARK_OUT: () => import('../models/transaction-types/PAC_CONDUIT_EARMARK_OUT.model'),
  PAC_IN_KIND_OUT: () => import('../models/transaction-types/PAC_IN_KIND_OUT.model'),
  PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_ATTRIBUTION_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model'),
  PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO: () =>
    import('../models/transaction-types/PARTNERSHIP_NATIONAL_PARTY_CONVENTION_JF_TRANSFER_MEMO.model'),
  PARTY_IN_KIND_OUT: () => import('../models/transaction-types/PARTY_IN_KIND_OUT.model'),
  RECOUNT_ACCOUNT_DISBURSEMENT: () => import('../models/transaction-types/RECOUNT_ACCOUNT_DISBURSEMENT.model'),
  REFUND_INDIVIDUAL_CONTRIBUTION: () => import('../models/transaction-types/REFUND_INDIVIDUAL_CONTRIBUTION.model'),
  REFUND_INDIVIDUAL_CONTRIBUTION_VOID: () =>
    import('../models/transaction-types/REFUND_INDIVIDUAL_CONTRIBUTION_VOID.model'),
  REFUND_PAC_CONTRIBUTION: () => import('../models/transaction-types/REFUND_PAC_CONTRIBUTION.model'),
  REFUND_PAC_CONTRIBUTION_VOID: () => import('../models/transaction-types/REFUND_PAC_CONTRIBUTION_VOID.model'),
  REFUND_PARTY_CONTRIBUTION: () => import('../models/transaction-types/REFUND_PARTY_CONTRIBUTION.model'),
  REFUND_PARTY_CONTRIBUTION_VOID: () => import('../models/transaction-types/REFUND_PARTY_CONTRIBUTION_VOID.model'),
  REFUND_TO_FEDERAL_CANDIDATE: () => import('../models/transaction-types/REFUND_TO_FEDERAL_CANDIDATE.model'),
  REFUND_TO_UNREGISTERED_COMMITTEE: () => import('../models/transaction-types/REFUND_TO_UNREGISTERED_COMMITTEE.model'),
  REFUND_UNREGISTERED_CONTRIBUTION: () => import('../models/transaction-types/REFUND_UNREGISTERED_CONTRIBUTION.model'),
  REFUND_UNREGISTERED_CONTRIBUTION_VOID: () =>
    import('../models/transaction-types/REFUND_UNREGISTERED_CONTRIBUTION_VOID.model'),
  TRANSFER_TO_AFFILIATES: () => import('../models/transaction-types/TRANSFER_TO_AFFILIATES.model'),
  TRIBAL_REFUND_NP_CONVENTION_ACCOUNT: () =>
    import('../models/transaction-types/TRIBAL_REFUND_NP_CONVENTION_ACCOUNT.model'),
  TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT: () =>
    import('../models/transaction-types/TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT.model'),
  TRIBAL_REFUND_NP_RECOUNT_ACCOUNT: () => import('../models/transaction-types/TRIBAL_REFUND_NP_RECOUNT_ACCOUNT.model'),

  // Schedule C
  LOAN_BY_COMMITTEE: () => import('../models/transaction-types/LOAN_BY_COMMITTEE.model'),
  LOAN_RECEIVED_FROM_BANK: () => import('../models/transaction-types/LOAN_RECEIVED_FROM_BANK.model'),
  LOAN_RECEIVED_FROM_INDIVIDUAL: () => import('../models/transaction-types/LOAN_RECEIVED_FROM_INDIVIDUAL.model'),

  // Schedule C1
  C1_LOAN_AGREEMENT: () => import('../models/transaction-types/C1_LOAN_AGREEMENT.model'),

  // Schedule C2
  C2_LOAN_GUARANTOR: () => import('../models/transaction-types/C2_LOAN_GUARANTOR.model'),

  // Schedule D
  DEBT_OWED_BY_COMMITTEE: () => import('../models/transaction-types/DEBT_OWED_BY_COMMITTEE.model'),
  DEBT_OWED_TO_COMMITTEE: () => import('../models/transaction-types/DEBT_OWED_TO_COMMITTEE.model'),

  // Schedule E
  INDEPENDENT_EXPENDITURE: () => import('../models/transaction-types/INDEPENDENT_EXPENDITURE.model'),
  INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT.model'),
  INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT_MEMO.model'),
  INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL.model'),
  INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO.model'),
  INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT.model'),
  INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO: () =>
    import('../models/transaction-types/INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO.model'),
  INDEPENDENT_EXPENDITURE_VOID: () => import('../models/transaction-types/INDEPENDENT_EXPENDITURE_VOID.model'),
  MULTISTATE_INDEPENDENT_EXPENDITURE: () =>
    import('../models/transaction-types/MULTISTATE_INDEPENDENT_EXPENDITURE.model'),

  // Schedule F
  COORDINATED_PARTY_EXPENDITURE: () => import('../models/transaction-types/COORDINATED_PARTY_EXPENDITURE.model'),
  COORDINATED_PARTY_EXPENDITURE_VOID: () =>
    import('../models/transaction-types/COORDINATED_PARTY_EXPENDITURE_VOID.model'),
};

export function PTY_ONLY(): Set<TransactionTypes> {
  return new Set([
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
    ScheduleBTransactionTypes.PAC_IN_KIND_OUT,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
  ]);
}

export function PAC_ONLY(): Set<TransactionTypes> {
  return new Set([
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
    ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
  ]);
}

export function MultipleEntryTransactionTypes(): string[] {
  return [
    ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
    ScheduleATransactionTypes.EARMARK_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    ScheduleATransactionTypes.IN_KIND_TRANSFER,
    ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
    ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_UNDEPOSITED,
    ScheduleATransactionTypes.PAC_CONDUIT_EARMARK_RECEIPT_DEPOSITED,
    ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
  ];
}
