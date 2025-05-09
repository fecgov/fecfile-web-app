import { plainToClass, plainToInstance, Transform } from 'class-transformer';
import { schema as f3Schema } from 'fecfile-validate/fecfile_validate_js/dist/F3';
import { ReportCodes } from '../utils/report-code.utils';
import { BaseModel } from './base.model';
import { Report, ReportStatus, ReportTypes } from './report.model';

export enum F3FormTypes {
  F3N = 'F3N',
  F3A = 'F3A',
  F3T = 'F3T',
}

export type F3FormType = F3FormTypes.F3N | F3FormTypes.F3A | F3FormTypes.F3T;

export class F3CoverageDates {
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | undefined;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | undefined;
  report_code: ReportCodes | undefined;
  report_code_label?: string;

  // prettier-ignore
  static fromJSON(json: any, reportCodeLabel: string): F3CoverageDates { // eslint-disable-line @typescript-eslint/no-explicit-any
    json.report_code_label = reportCodeLabel;
    return plainToClass(F3CoverageDates, json);
  }
}

export class Form3 extends Report {
  schema = f3Schema;
  report_type = ReportTypes.F3;
  form_type = F3FormTypes.F3N;
  override hasChangeOfAddress = true;
  change_of_address: boolean | undefined;
  election_state: string | undefined;
  election_district: string | undefined;
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
  calculation_status: string | undefined;

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

  override get coverageDates(): { [date: string]: Date | undefined } {
    return { coverage_from_date: this.coverage_from_date, coverage_through_date: this.coverage_through_date };
  }

  override get canAmend(): boolean {
    return this.report_status === ReportStatus.SUBMIT_SUCCESS;
  }

  get formLabel() {
    return 'FORM 3';
  }

  get formSubLabel() {
    return this.report_code_label ?? '';
  }

  static fromJSON(json: unknown): Form3 {
    return plainToInstance(Form3, json);
  }
}
