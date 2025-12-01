import { Exclude, plainToInstance } from 'class-transformer';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { ReportStatus, ReportTypes } from './report.model';
import { BaseForm3 } from './base-form-3';
import { ScheduleBTransactionTypes } from '../schb-transaction.model';
import { ScheduleFTransactionTypes } from '../schf-transaction.model';
import { ScheduleETransactionTypes } from '../sche-transaction.model';
import { ScheduleATransactionTypes } from '../scha-transaction.model';
import { ScheduleDTransactionTypes } from '../schd-transaction.model';
import { ScheduleCTransactionTypes } from '../schc-transaction.model';
import { MenuInfo, ReportSidebarSection } from 'app/layout/sidebar/menu-info';
import { MenuItem } from 'primeng/api';

export enum F3xFormTypes {
  F3XN = 'F3XN',
  F3XA = 'F3XA',
  F3XT = 'F3XT',
}

export class Form3X extends BaseForm3 {
  schema = f3xSchema;
  report_type = ReportTypes.F3X;
  form_type = F3xFormTypes.F3XN;
  filing_frequency: string | undefined;
  report_type_category: string | undefined;

  L6b_cash_on_hand_beginning_period: number | undefined;
  L6c_total_receipts_period: number | undefined;
  L6d_subtotal_period: number | undefined;
  L7_total_disbursements_period: number | undefined;
  L8_cash_on_hand_at_close_period: number | undefined;
  L9_debts_to_period: number | undefined;
  L10_debts_by_period: number | undefined;
  L11ai_itemized_period: number | undefined;
  L11aii_unitemized_period: number | undefined;
  L11aiii_total_period: number | undefined;
  L11b_political_party_committees_period: number | undefined;
  L11c_other_political_committees_pacs_period: number | undefined;
  L11d_total_contributions_period: number | undefined;
  L12_transfers_from_affiliated_other_party_cmtes_period: number | undefined;
  L13_all_loans_received_period: number | undefined;
  L14_loan_repayments_received_period: number | undefined;
  L15_offsets_to_operating_expenditures_refunds_period: number | undefined;
  L16_refunds_of_federal_contributions_period: number | undefined;
  L17_other_federal_receipts_dividends_period: number | undefined;
  L18a_transfers_from_nonfederal_account_h3_period: number | undefined;
  L18b_transfers_from_nonfederal_levin_h5_period: number | undefined;
  L18c_total_nonfederal_transfers_18a_18b_period: number | undefined;
  L19_total_receipts_period: number | undefined;
  L20_total_federal_receipts_period: number | undefined;
  L21ai_federal_share_period: number | undefined;
  L21aii_nonfederal_share_period: number | undefined;
  L21b_other_federal_operating_expenditures_period: number | undefined;
  L21c_total_operating_expenditures_period: number | undefined;
  L22_transfers_to_affiliated_other_party_cmtes_period: number | undefined;
  L23_contributions_to_federal_candidates_cmtes_period: number | undefined;
  L24_independent_expenditures_period: number | undefined;
  L25_coordinated_expend_made_by_party_cmtes_period: number | undefined;
  L26_loan_repayments_period: number | undefined;
  L27_loans_made_period: number | undefined;
  L28a_individuals_persons_period: number | undefined;
  L28b_political_party_committees_period: number | undefined;
  L28c_other_political_committees_period: number | undefined;
  L28d_total_contributions_refunds_period: number | undefined;
  L29_other_disbursements_period: number | undefined;
  L30ai_shared_federal_activity_h6_fed_share_period: number | undefined;
  L30aii_shared_federal_activity_h6_nonfed_period: number | undefined;
  L30b_nonallocable_fed_election_activity_period: number | undefined;
  L30c_total_federal_election_activity_period: number | undefined;
  L31_total_disbursements_period: number | undefined;
  L32_total_federal_disbursements_period: number | undefined;
  L33_total_contributions_period: number | undefined;
  L34_total_contribution_refunds_period: number | undefined;
  L35_net_contributions_period: number | undefined;
  L36_total_federal_operating_expenditures_period: number | undefined;
  L37_offsets_to_operating_expenditures_period: number | undefined;
  L38_net_operating_expenditures_period: number | undefined;
  L6a_cash_on_hand_jan_1_ytd: number | undefined;
  L6a_year_for_above_ytd: string | undefined;
  L6c_total_receipts_ytd: number | undefined;
  L6d_subtotal_ytd: number | undefined;
  L7_total_disbursements_ytd: number | undefined;
  L8_cash_on_hand_close_ytd: number | undefined;
  L11ai_itemized_ytd: number | undefined;
  L11aii_unitemized_ytd: number | undefined;
  L11aiii_total_ytd: number | undefined;
  L11b_political_party_committees_ytd: number | undefined;
  L11c_other_political_committees_pacs_ytd: number | undefined;
  L11d_total_contributions_ytd: number | undefined;
  L12_transfers_from_affiliated_other_party_cmtes_ytd: number | undefined;
  L13_all_loans_received_ytd: number | undefined;
  L14_loan_repayments_received_ytd: number | undefined;
  L15_offsets_to_operating_expenditures_refunds_ytd: number | undefined;
  L16_refunds_of_federal_contributions_ytd: number | undefined;
  L17_other_federal_receipts_dividends_ytd: number | undefined;
  L18a_transfers_from_nonfederal_account_h3_ytd: number | undefined;
  L18b_transfers_from_nonfederal_levin_h5_ytd: number | undefined;
  L18c_total_nonfederal_transfers_18a_18b_ytd: number | undefined;
  L19_total_receipts_ytd: number | undefined;
  L20_total_federal_receipts_ytd: number | undefined;
  L21ai_federal_share_ytd: number | undefined;
  L21aii_nonfederal_share_ytd: number | undefined;
  L21b_other_federal_operating_expenditures_ytd: number | undefined;
  L21c_total_operating_expenditures_ytd: number | undefined;
  L22_transfers_to_affiliated_other_party_cmtes_ytd: number | undefined;
  L23_contributions_to_federal_candidates_cmtes_ytd: number | undefined;
  L24_independent_expenditures_ytd: number | undefined;
  L25_coordinated_expend_made_by_party_cmtes_ytd: number | undefined;
  L26_loan_repayments_made_ytd: number | undefined;
  L27_loans_made_ytd: number | undefined;
  L28a_individuals_persons_ytd: number | undefined;
  L28b_political_party_committees_ytd: number | undefined;
  L28c_other_political_committees_ytd: number | undefined;
  L28d_total_contributions_refunds_ytd: number | undefined;
  L29_other_disbursements_ytd: number | undefined;
  L30ai_shared_federal_activity_h6_fed_share_ytd: number | undefined;
  L30aii_shared_federal_activity_h6_nonfed_ytd: number | undefined;
  L30b_nonallocable_fed_election_activity_ytd: number | undefined;
  L30c_total_federal_election_activity_ytd: number | undefined;
  L31_total_disbursements_ytd: number | undefined;
  L32_total_federal_disbursements_ytd: number | undefined;
  L33_total_contributions_ytd: number | undefined;
  L34_total_contribution_refunds_ytd: number | undefined;
  L35_net_contributions_ytd: number | undefined;
  L36_total_federal_operating_expenditures_ytd: number | undefined;
  L37_offsets_to_operating_expenditures_ytd: number | undefined;
  L38_net_operating_expenditures_ytd: number | undefined;

  @Exclude()
  override transactionTypes = [
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
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_PAC_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_100PCT_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_VOID,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_CREDIT_CARD_PAYMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_STAFF_REIMBURSEMENT,
    ScheduleBTransactionTypes.FEDERAL_ELECTION_ACTIVITY_PAYMENT_TO_PAYROLL,
  ];

  get formLabel() {
    return 'Form 3X';
  }

  static fromJSON(json: unknown): Form3X {
    return plainToInstance(Form3X, json);
  }

  getMenuItems(sidebarSection: ReportSidebarSection, isEditable: boolean): MenuItem[] {
    const transactionItems = [MenuInfo.manageTransactions(this), ...MenuInfo.addTransactions(this)];
    const menuItems = [
      MenuInfo.enterTransaction(sidebarSection, isEditable, transactionItems),
      MenuInfo.reviewTransactions(sidebarSection, this, isEditable),
      MenuInfo.reviewReport(sidebarSection, [
        ...MenuInfo.viewSummary(this),
        MenuInfo.printPreview(this),
        MenuInfo.addReportLevelMenu(this, isEditable),
      ]),
      MenuInfo.submitReport(sidebarSection, this, isEditable, 'SUBMIT YOUR REPORT'),
    ];

    // Add edit report item to menu if the report is in progress or submission failure
    if (this.report_status === ReportStatus.IN_PROGRESS || this.report_status === ReportStatus.SUBMIT_FAILURE) {
      const editReportItem = MenuInfo.editReport(sidebarSection, this, 'EDIT REPORT DETAILS');
      menuItems.unshift(editReportItem);
    }
    return menuItems;
  }
}
