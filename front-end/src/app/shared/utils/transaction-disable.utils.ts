import { ReportTypes } from 'app/shared/models/reports/report.model';
import { ScheduleATransactionTypes } from 'app/shared/models/scha-transaction.model';
import { ScheduleBTransactionTypes } from 'app/shared/models/schb-transaction.model';
import { ScheduleCTransactionTypes } from 'app/shared/models/schc-transaction.model';
import { ScheduleDTransactionTypes } from 'app/shared/models/schd-transaction.model';
import { ScheduleFTransactionTypes } from 'app/shared/models/schf-transaction.model';
import { TransactionTypes } from 'app/shared/models/transaction.model';

// Add transaction types per report type to disable them.
export const DISABLED_TRANSACTION_TYPES: Partial<Record<ReportTypes, Set<TransactionTypes>>> = {
  [ReportTypes.F3]: new Set<TransactionTypes>([
    /*** RECEIPTS **********************************************/
    // CONTRIBUTIONS FROM INDIVIDUALS/PERSONS
    ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_RECEIPT,
    ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
    ScheduleATransactionTypes.EARMARK_RECEIPT,
    // CONTRIBUTIONS FROM REGISTERED FILERS
    ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    ScheduleATransactionTypes.CONTRIBUTION_FROM_CANDIDATE,
    ScheduleATransactionTypes.IN_KIND_CONTRIBUTION_FROM_CANDIDATE,
    // TRANSFERS
    ScheduleATransactionTypes.AUTHORIZED_COMMITTEE_TRANSFER,
    ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    ScheduleATransactionTypes.IN_KIND_TRANSFER,
    // OTHER
    ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    ScheduleATransactionTypes.OTHER_RECEIPTS,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
    ScheduleATransactionTypes.FEDERAL_COMMITTEE_RECOUNT_DONATION,
    ScheduleATransactionTypes.UNREGISTERED_RECOUNT_DONATION_FROM_ORGANIZATION,

    /*** DISBURSEMENT **********************************************/
    // OPERATING EXPENDITURES
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
    // CONTRIBUTIONS/EXPENDITURES
    ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
    // OTHER EXPENDITURES
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_FEDERAL_CANDIDATE_CONTRIBUTION,
    ScheduleBTransactionTypes.OTHER_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.UNREGISTERED_ORGANIZATION_CONTRIBUTION,
    ScheduleBTransactionTypes.DISGORGEMENT,
    // REFUNDS
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION_VOID,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION_VOID,

    /*** LOANS AND DEBTS ********************************************/
    // LOANS
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
    ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    // DEBTS
    ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
    ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
  ]),
};

export function isTransactionTypeDisabledForReport(reportType: ReportTypes, transactionType: string): boolean {
  return !!DISABLED_TRANSACTION_TYPES[reportType]?.has(transactionType as TransactionTypes);
}
