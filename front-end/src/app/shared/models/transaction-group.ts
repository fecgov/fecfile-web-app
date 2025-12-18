import { ScheduleATransactionTypes } from './scha-transaction.model';
import { ScheduleBTransactionTypes } from './schb-transaction.model';
import { ScheduleCTransactionTypes } from './schc-transaction.model';
import { ScheduleDTransactionTypes } from './schd-transaction.model';
import { ScheduleETransactionTypes } from './sche-transaction.model';
import { ScheduleFTransactionTypes } from './schf-transaction.model';
import { TransactionTypes } from './transaction.model';

export enum Categories {
  RECEIPT = 'receipt',
  DISBURSEMENT = 'disbursement',
  LOANS_AND_DEBTS = 'loans-and-debts',
}

interface TransactionGroup {
  label: string;
  transactionTypes: Set<TransactionTypes>;
}

export const Disbursement: TransactionGroup[] = [
  {
    label: 'OPERATING EXPENDITURES',
    transactionTypes: new Set([
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
      ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
    ]),
  },
  {
    label: 'CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS',
    transactionTypes: new Set([
      ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
      ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE,
      ScheduleBTransactionTypes.CONTRIBUTION_TO_CANDIDATE_VOID,
      ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE,
      ScheduleBTransactionTypes.CONTRIBUTION_TO_OTHER_COMMITTEE_VOID,
      ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_CANDIDATE,
      ScheduleBTransactionTypes.IN_KIND_CONTRIBUTION_TO_OTHER_COMMITTEE,
      ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
      ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE,
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_VOID,
      ScheduleETransactionTypes.MULTISTATE_INDEPENDENT_EXPENDITURE,
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_CREDIT_CARD_PAYMENT,
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_STAFF_REIMBURSEMENT,
      ScheduleETransactionTypes.INDEPENDENT_EXPENDITURE_PAYMENT_TO_PAYROLL,
    ]),
  },
  {
    label: 'OTHER EXPENDITURES',
    transactionTypes: new Set([
      ScheduleBTransactionTypes.BUSINESS_LABOR_REFUND_NON_CONTRIBUTION_ACCOUNT,
      ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
      ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
      ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_CONVENTION_ACCOUNT,
      ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NP_RECOUNT_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_NON_CONTRIBUTION_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
      ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
      ScheduleBTransactionTypes.OTHER_DISBURSEMENT_CREDIT_CARD_PAYMENT,
      ScheduleBTransactionTypes.OTHER_DISBURSEMENT_STAFF_REIMBURSEMENT,
      ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
      ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL,
      ScheduleBTransactionTypes.NATIONAL_PARTY_RECOUNT_ACCOUNT_DISBURSEMENT,
      ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
      ScheduleBTransactionTypes.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_DISBURSEMENT,
      ScheduleBTransactionTypes.NATIONAL_PARTY_CONVENTION_ACCOUNT_DISBURSEMENT,
      ScheduleBTransactionTypes.TRIBAL_REFUND_NP_HEADQUARTERS_ACCOUNT,
      ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
      ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_HEADQUARTERS_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_CONVENTION_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_COMMITTEE_REFUND_REFUND_NP_RECOUNT_ACCOUNT,
      ScheduleBTransactionTypes.OTHER_FEDERAL_CANDIDATE_CONTRIBUTION,
      ScheduleBTransactionTypes.OTHER_FEDERAL_COMMITTEE_CONTRIBUTION,
      ScheduleBTransactionTypes.UNREGISTERED_ORGANIZATION_CONTRIBUTION,
      ScheduleBTransactionTypes.DISGORGEMENT,
    ]),
  },
  {
    label: 'REFUNDS',
    transactionTypes: new Set([
      ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
      ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
      ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
      ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
      ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION,
      ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION_VOID,
      ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION,
      ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION_VOID,
      ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION,
      ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID,
      ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION,
      ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
    ]),
  },
  {
    label: 'FEDERAL ELECTION ACTIVITY EXPENDITURES',
    transactionTypes: new Set([
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
      ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
    ]),
  },
];
export type DisbursementType = (typeof Disbursement)[keyof typeof Disbursement];

export const LoansAndDebts: TransactionGroup[] = [
  {
    label: 'LOANS',
    transactionTypes: new Set([
      ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
      ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
      ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    ]),
  },
  {
    label: 'DEBTS',
    transactionTypes: new Set([
      ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
      ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
    ]),
  },
];

export type LoansAndDebtsType = (typeof LoansAndDebts)[keyof typeof LoansAndDebts];

export const Receipt: TransactionGroup[] = [
  {
    label: 'CONTRIBUTIONS FROM INDIVIDUALS/PERSONS',
    transactionTypes: new Set([
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      ScheduleATransactionTypes.TRIBAL_RECEIPT,
      ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
      ScheduleATransactionTypes.IN_KIND_RECEIPT,
      ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
      ScheduleATransactionTypes.EARMARK_RECEIPT,
      ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
      ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY,
      ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
    ]),
  },
  {
    label: 'CONTRIBUTIONS FROM REGISTERED FILERS',
    transactionTypes: new Set([
      ScheduleATransactionTypes.PARTY_RECEIPT,
      ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
      ScheduleATransactionTypes.PARTY_RETURN,
      ScheduleATransactionTypes.PAC_RECEIPT,
      ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
      ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
      ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
      ScheduleATransactionTypes.PAC_RETURN,
      ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
      ScheduleATransactionTypes.IN_KIND_CONTRIBUTION_FROM_CANDIDATE,
    ]),
  },
  {
    label: 'TRANSFERS',
    transactionTypes: new Set([
      ScheduleATransactionTypes.TRANSFER,
      ScheduleATransactionTypes.AUTHORIZED_COMMITTEE_TRANSFER,
      ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
      ScheduleATransactionTypes.IN_KIND_TRANSFER,
      ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ]),
  },
  {
    label: 'REFUNDS',
    transactionTypes: new Set([
      ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
      ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
      ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE,
    ]),
  },
  {
    label: 'OTHER',
    transactionTypes: new Set([
      ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      ScheduleATransactionTypes.OTHER_RECEIPTS,
      ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
      ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
      ScheduleATransactionTypes.FEDERAL_COMMITTEE_RECOUNT_DONATION,
      ScheduleATransactionTypes.UNREGISTERED_RECOUNT_DONATION_FROM_ORGANIZATION,
      ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
      ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
      ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
      ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT,
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.PARTY_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_RECOUNT_ACCOUNT_CONTRIBUTION,
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_CONVENTION_ACCOUNT_CONTRIBUTION,
      ScheduleATransactionTypes.EARMARK_RECEIPT_FOR_HEADQUARTERS_ACCOUNT_CONTRIBUTION,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_CONVENTION_ACCOUNT,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ]),
  },
];

export type ReceiptType = (typeof Receipt)[keyof typeof Receipt];

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- used only for deriving the type below
const ScheduleC1TransactionGroups = {
  LOAN_AGREEMENTS: { type: 'ScheduleC1TransactionGroups', label: 'LOAN AGREEMENTS' },
} as const;
export type ScheduleC1TransactionGroupsType =
  (typeof ScheduleC1TransactionGroups)[keyof typeof ScheduleC1TransactionGroups];

export const CategoryPicker = new Map<Categories, TransactionGroup[]>([
  [Categories.RECEIPT, Receipt],
  [Categories.DISBURSEMENT, Disbursement],
  [Categories.LOANS_AND_DEBTS, LoansAndDebts],
]);
