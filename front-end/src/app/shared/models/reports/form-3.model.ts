import { Exclude, plainToInstance } from 'class-transformer';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';

import { ReportTypes } from './report.model';
import { BaseForm3 } from './base-form-3';
import { Categories, Disbursement, DisbursementType } from '../transaction-group';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupTypes, TransactionTypes } from '../transaction.model';
import { ScheduleFTransactionTypes } from '../schf-transaction.model';

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

  constructor() {
    super();

    this.transactionGroupCategories = new Map([
      [Categories.RECEIPT, this.receiptTransactionGroup],
      [Categories.DISBURSEMENT, this.disbursementTransactionGroup],
      [Categories.LOANS_AND_DEBTS, this.loanTransactionGroup],
    ]);

    this.transactionTypeMap = new Map<TransactionGroupTypes, TransactionTypes[]>([
      ...this.receiptTransactionMap,
      ...this.disbursementTransactionMap,
      ...this.loansTransactionMap,
    ]);
  }

  get formLabel() {
    return 'Form 3';
  }

  static fromJSON(json: unknown): Form3 {
    return plainToInstance(Form3, json);
  }

  @Exclude()
  private disbursementTransactionGroup = [
    Disbursement.OPERATING_EXPENDITURES,
    Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS,
    Disbursement.OTHER_EXPENDITURES,
    Disbursement.REFUNDS,
  ];

  @Exclude()
  private disbursementTransactionMap = new Map<DisbursementType, TransactionTypes[]>([
    [
      Disbursement.OPERATING_EXPENDITURES,
      [
        ScheduleBTransactionTypes.OPERATING_EXPENDITURE,
        ScheduleBTransactionTypes.OPERATING_EXPENDITURE_VOID,
        ScheduleBTransactionTypes.OPERATING_EXPENDITURE_CREDIT_CARD_PAYMENT,
        ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
        ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
      ],
    ],
    [
      Disbursement.CONTRIBUTIONS_EXPENDITURES_TO_REGISTERED_FILERS,
      [
        ScheduleBTransactionTypes.TRANSFER_TO_AFFILIATES,
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
      ],
    ],
    [
      Disbursement.OTHER_EXPENDITURES,
      [
        ScheduleBTransactionTypes.OTHER_DISBURSEMENT,
        ScheduleBTransactionTypes.OTHER_DISBURSEMENT_VOID,
        ScheduleBTransactionTypes.RECOUNT_ACCOUNT_DISBURSEMENT,
        ScheduleBTransactionTypes.OTHER_FEDERAL_CANDIDATE_CONTRIBUTION,
        ScheduleBTransactionTypes.OTHER_FEDERAL_COMMITTEE_CONTRIBUTION,
        ScheduleBTransactionTypes.UNREGISTERED_ORGANIZATION_CONTRIBUTION,
        ScheduleBTransactionTypes.DISGORGEMENT,
      ],
    ],
    [
      Disbursement.REFUNDS,
      [
        ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
        ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
        ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
        ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
        ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION,
        ScheduleBTransactionTypes.REFUND_UNREGISTERED_RECEIPT_ORGANIZATION_VOID,
        ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION,
        ScheduleBTransactionTypes.REFUND_FEDERAL_COMMITTEE_CONTRIBUTION_VOID,
      ],
    ],
    [
      Disbursement.FEDERAL_ELECTION_ACTIVITY_EXPENDITURES,
      [
        ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
        ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
        ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
        ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
        ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
      ],
    ],
    [
      Disbursement.COORDINATED_EXPENDITURES,
      [
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE,
        ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID,
      ],
    ],
  ]);
}
