import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class FecFiling extends BaseModel {
  additional_bank_names: string[] = [];
  amendment_chain: number[] = [];
  amendment_indicator: string | undefined;
  amendment_version: number | undefined;
  bank_depository_city: string | undefined;
  bank_depository_name: string | undefined;
  bank_depository_state: string | undefined;
  bank_depository_street_1: string | undefined;
  bank_depository_street_2: string | undefined;
  bank_depository_zip: string | undefined;
  beginning_image_number: string | undefined;
  candidate_id: string | undefined;
  candidate_name: string | undefined;
  cash_on_hand_beginning_period: number | undefined;
  cash_on_hand_end_period: number | undefined;
  committee_id: string | undefined;
  committee_name: string | undefined;
  committee_type: string | undefined;
  coverage_end_date: Date | undefined;
  coverage_start_date: Date | undefined;
  csv_url: string | undefined;
  cycle: number | undefined;
  debts_owed_by_committee: number | undefined;
  debts_owed_to_committee: number | undefined;
  document_description: string | undefined;
  document_type: string | undefined;
  document_type_full: string | undefined;
  election_year: number | undefined;
  ending_image_number: string | undefined;
  fec_file_id: string | undefined;
  fec_url: string | undefined;
  file_number: number | undefined;
  form_category: string | undefined;
  form_type: string | undefined;
  house_personal_funds: number | undefined;
  html_url: string | undefined;
  is_amended: boolean | undefined;
  means_filed: string | undefined;
  most_recent: boolean | undefined;
  most_recent_file_number: number | undefined;
  net_donations: number | undefined;
  office: string | undefined;
  opposition_personal_funds: number | undefined;
  pages: number | undefined;
  party: string | undefined;
  pdf_url: string | undefined;
  previous_file_number: number | undefined;
  primary_general_indicator: string | undefined;
  receipt_date: Date | undefined;
  report_type: string | undefined;
  report_type_full: string | undefined;
  report_year: number | undefined;
  request_type: string | undefined;
  senate_personal_funds: number | undefined;
  state: string | undefined;
  sub_id: string | undefined;
  total_communication_cost: number | undefined;
  total_disbursements: number | undefined;
  total_independent_expenditures: number | undefined;
  total_individual_contributions: number | undefined;
  total_receipts: number | undefined;
  treasurer_name: string | undefined;
  update_date: Date | undefined;

  // prettier-ignore
  static fromJSON(json: any): FecFiling { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(FecFiling, json);
  }
}
