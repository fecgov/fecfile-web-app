import { Exclude, plainToInstance } from 'class-transformer';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { ReportTypes } from './report.model';
import { BaseForm3 } from './base-form-3';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { ScheduleFTransactionTypes } from '../schf-transaction.model';
import { TransactionTypes } from '../transaction.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleCTransactionTypes } from '../schc-transaction.model';
import { ScheduleDTransactionTypes } from '../schd-transaction.model';

export enum F3FormTypes {
  F3N = 'F3N',
  F3A = 'F3A',
  F3T = 'F3T',
}

export type F3FormType = F3FormTypes.F3N | F3FormTypes.F3A | F3FormTypes.F3T;

export class Form3 extends BaseForm3 {
  schema = f3Schema;
  report_type = ReportTypes.F3;
  form_type = F3FormTypes.F3N;
  election_state: string | undefined;
  election_district: string | undefined;

  L6a_total_contributions_period: number | undefined;
  L6b_total_contribution_refunds_period: number | undefined;
  L6c_net_contributions_period: number | undefined;
  L7a_total_operating_expenditures_period: number | undefined;
  L7b_total_offsets_to_operating_expenditures_period: number | undefined;
  L7c_net_operating_expenditures_period: number | undefined;
  L8_cash_on_hand_at_close_period: number | undefined;
  L9_debts_owed_to_committee_period: number | undefined;
  L10_debts_owed_by_committee_period: number | undefined;
  L11ai_individuals_itemized_period: number | undefined;
  L11aii_individuals_unitemized_period: number | undefined;
  L11aiii_total_individual_period: number | undefined;
  L11b_political_party_committees_period: number | undefined;
  L11c_other_political_committees_period: number | undefined;
  L11d_the_candidate_period: number | undefined;
  L11e_total_contributions_period: number | undefined;
  L12_transfers_from_other_authorized_committees_period: number | undefined;
  L13a_loans_made_or_guaranteed_by_the_candidate_period: number | undefined;
  L13b_all_other_loans_period: number | undefined;
  L13c_total_loans_period: number | undefined;
  L14_offsets_to_operating_expenditures_period: number | undefined;
  L15_other_receipts_period: number | undefined;
  L16_total_receipts_period: number | undefined;
  L17_operating_expenditures_period: number | undefined;
  L18_transfers_to_other_authorized_committees_period: number | undefined;
  L19a_loan_repayments_of_loans_made_or_guaranteed_by_candidate_period: number | undefined;
  L19b_loan_repayments_of_all_other_loans_period: number | undefined;
  L19c_total_loan_repayments_period: number | undefined;
  L20a_refunds_to_individuals_period: number | undefined;
  L20b_refunds_to_political_party_committees_period: number | undefined;
  L20c_refunds_to_other_political_committees_period: number | undefined;
  L20d_total_contribution_refunds_period: number | undefined;
  L21_other_disbursements_period: number | undefined;
  L22_total_disbursements_period: number | undefined;
  L23_cash_on_hand_beginning_reporting_period: number | undefined;
  L24_total_receipts_period: number | undefined;
  L25_subtotals_period: number | undefined;
  L26_total_disbursements_period: number | undefined;
  L27_cash_on_hand_at_close_period: number | undefined;
  L6a_total_contributions_ytd: number | undefined;
  L6b_total_contribution_refunds_ytd: number | undefined;
  L6c_net_contributions_ytd: number | undefined;
  L7a_total_operating_expenditures_ytd: number | undefined;
  L7b_total_offsets_to_operating_expenditures_ytd: number | undefined;
  L7c_net_operating_expenditures_ytd: number | undefined;
  L11ai_individuals_itemized_ytd: number | undefined;
  L11aii_individuals_unitemized_ytd: number | undefined;
  L11aiii_total_individual_ytd: number | undefined;
  L11b_political_party_committees_ytd: number | undefined;
  L11c_other_political_committees_ytd: number | undefined;
  L11d_the_candidate_ytd: number | undefined;
  L11e_total_contributions_ytd: number | undefined;
  L12_transfers_from_other_authorized_committees_ytd: number | undefined;
  L13a_loans_made_or_guaranteed_by_the_candidate_ytd: number | undefined;
  L13b_all_other_loans_ytd: number | undefined;
  L13c_total_loans_ytd: number | undefined;
  L14_offsets_to_operating_expenditures_ytd: number | undefined;
  L15_other_receipts_ytd: number | undefined;
  L16_total_receipts_ytd: number | undefined;
  L17_operating_expenditures_ytd: number | undefined;
  L18_transfers_to_other_authorized_committees_ytd: number | undefined;
  L19a_loan_repayments_of_loans_made_or_guaranteed_by_candidate_ytd: number | undefined;
  L19b_loan_repayments_of_all_other_loans_ytd: number | undefined;
  L19c_total_loan_repayments_ytd: number | undefined;
  L20a_refunds_to_individuals_ytd: number | undefined;
  L20b_refunds_to_political_party_committees_ytd: number | undefined;
  L20c_refunds_to_other_political_committees_ytd: number | undefined;
  L20d_total_contribution_refunds_ytd: number | undefined;
  L21_other_disbursements_ytd: number | undefined;
  L22_total_disbursements_ytd: number | undefined;

  @Exclude()
  override transactionTypes: TransactionTypes[] = [
    // RECEIPTS
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
    ScheduleATransactionTypes.TRIBAL_RECEIPT,
    ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
    ScheduleATransactionTypes.IN_KIND_RECEIPT,
    ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
    ScheduleATransactionTypes.EARMARK_RECEIPT,
    ScheduleATransactionTypes.CONDUIT_EARMARK_RECEIPT,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY,
    ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY_RETURN,
    ScheduleATransactionTypes.PARTY_RECEIPT,
    ScheduleATransactionTypes.PARTY_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PARTY_RETURN,
    ScheduleATransactionTypes.PAC_RECEIPT,
    ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    ScheduleATransactionTypes.PAC_EARMARK_RECEIPT,
    ScheduleATransactionTypes.PAC_CONDUIT_EARMARK,
    ScheduleATransactionTypes.PAC_RETURN,
    ScheduleATransactionTypes.TRANSFER,
    ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
    ScheduleATransactionTypes.IN_KIND_TRANSFER,
    ScheduleATransactionTypes.IN_KIND_TRANSFER_FEDERAL_ELECTION_ACTIVITY,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_RECOUNT_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_CONVENTION_ACCOUNT,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
    ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
    ScheduleATransactionTypes.REFUND_TO_UNREGISTERED_COMMITTEE,
    ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
    ScheduleATransactionTypes.OTHER_RECEIPTS,
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.OTHER_COMMITTEE_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
    ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
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
    // LOANS AND DEBTS
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL,
    ScheduleCTransactionTypes.LOAN_RECEIVED_FROM_BANK,
    ScheduleCTransactionTypes.LOAN_BY_COMMITTEE,
    ScheduleDTransactionTypes.DEBT_OWED_BY_COMMITTEE,
    ScheduleDTransactionTypes.DEBT_OWED_TO_COMMITTEE,
    // DISBURSEMENTS
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
    ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
    ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
    ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
    ScheduleBTransactionTypes.OTHER_FEDERAL_CANDIDATE_CONTRIBUTION,
    ScheduleBTransactionTypes.OTHER_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.UNREGISTERED_ORGANIZATION_CONTRIBUTION,
    ScheduleBTransactionTypes.DISGORGEMENT,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION_VOID,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION_VOID,
  ];

  get formLabel() {
    return 'Form 3';
  }

  static fromJSON(json: unknown): Form3 {
    return plainToInstance(Form3, json);
  }
}
