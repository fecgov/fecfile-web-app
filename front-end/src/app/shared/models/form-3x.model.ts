import { plainToClass, plainToInstance, Transform } from 'class-transformer';
import { schema as f3xSchema } from 'fecfile-validate/fecfile_validate_js/dist/F3X';
import { F3xReportCodes, getReportCodeLabel } from '../utils/report-code.utils';
import { BaseModel } from './base.model';
import { Report, ReportStatus, ReportTypes } from './report.model';

export enum F3xFormTypes {
  F3XN = 'F3XN',
  F3XA = 'F3XA',
  F3XT = 'F3XT',
}

export type F3xFormType = F3xFormTypes.F3XN | F3xFormTypes.F3XA | F3xFormTypes.F3XT;

export const F3xFormVersionLabels: { [key in F3xFormTypes]: string } = {
  [F3xFormTypes.F3XN]: 'Original',
  [F3xFormTypes.F3XA]: 'Amendment',
  [F3xFormTypes.F3XT]: 'Termination',
};

export class F3xCoverageDates {
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  report_code: F3xReportCodes | undefined;

  // prettier-ignore
  static fromJSON(json: any): F3xCoverageDates { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(F3xCoverageDates, json);
  }
}

export const F3xQualifiedCommitteeTypeCodes = ['Q', 'W', 'Y'];

export class Form3X extends Report {
  schema = f3xSchema;
  report_type = ReportTypes.F3X;
  form_type = F3xFormTypes.F3XN;
  override hasChangeOfAddress = true;
  committee_name: string | undefined;
  change_of_address: boolean | undefined;
  street_1: string | undefined;
  street_2: string | undefined;
  city: string | undefined;
  state: string | undefined;
  zip: string | undefined;
  report_code: F3xReportCodes | undefined;
  election_code: string | undefined;
  @Transform(BaseModel.dateTransform) date_of_election: Date | undefined;
  state_of_election: string | undefined;
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  qualified_committee: boolean | undefined;
  treasurer_last_name: string | undefined;
  treasurer_first_name: string | undefined;
  treasurer_middle_name: string | undefined;
  treasurer_prefix: string | undefined;
  treasurer_suffix: string | undefined;
  @Transform(BaseModel.dateTransform) date_signed: Date | undefined;
  @Transform(BaseModel.dateTransform) cash_on_hand_date: Date | undefined;
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
  calculation_status: string | undefined;

  override get reportCode(): F3xReportCodes | undefined {
    return this.report_code;
  }

  override get coverageDates(): { [date: string]: Date | undefined } {
    return { coverage_from_date: this.coverage_from_date, coverage_through_date: this.coverage_through_date };
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }

  get formLabel() {
    return 'FORM 3X';
  }

  get formSubLabel() {
    return getReportCodeLabel(this.report_code) ?? '';
  }

  get versionLabel() {
    return `${F3xFormVersionLabels[this.form_type]} ${this.report_version ?? ''}`.trim();
  }

  // prettier-ignore
  static fromJSON(json: any): Form3X { // eslint-disable-line @typescript-eslint/no-explicit-any
    // json['form_type'] = F3xFormTypes.F3XT;
    return plainToInstance(Form3X, json);
  }

  override getBlocker() {
    if (!this.L6a_cash_on_hand_jan_1_ytd)
      return '*** You may not submit a report until you have entered an amount for Cash on Hand ***';
    return;
  }
}
