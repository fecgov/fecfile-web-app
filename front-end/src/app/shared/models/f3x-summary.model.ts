import { plainToClass, Transform, Type } from 'class-transformer';
import { Report } from '../interfaces/report.interface';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { UploadSubmission } from './upload-submission.model';
import { WebPrintSubmission } from './webprint-submission.model';

export enum F3xFormTypes {
  F3XN = 'F3XN',
  F3XA = 'F3XA',
  F3XT = 'F3XT',
}

export type F3xFormType = F3xFormTypes.F3XN | F3xFormTypes.F3XA | F3xFormTypes.F3XT;

export const F3xFormTypeLabels: LabelList = [
  [F3xFormTypes.F3XN, 'FORM 3X'],
  [F3xFormTypes.F3XA, 'FORM 3X'],
  [F3xFormTypes.F3XT, 'FORM 3X'],
];

export const F3xFormVersionLabels: LabelList = [
  [F3xFormTypes.F3XN, 'Original'],
  [F3xFormTypes.F3XA, 'Amendment'],
  [F3xFormTypes.F3XT, 'Termination'],
];

export enum F3xReportCodes {
  Q1 = 'Q1',
  Q2 = 'Q2',
  Q3 = 'Q3',
  YE = 'YE',
  TER = 'TER',
  MY = 'MY',
  TwelveG = '12G',
  TwelveP = '12P',
  TwelveR = '12R',
  TwelveS = '12S',
  TwelveC = '12C',
  ThirtyG = '30G',
  ThirtyR = '30R',
  ThirtyS = '30S',
  M2 = 'M2',
  M3 = 'M3',
  M4 = 'M4',
  M5 = 'M5',
  M6 = 'M6',
  M7 = 'M7',
  M8 = 'M8',
  M9 = 'M9',
  M10 = 'M10',
  M11 = 'M11',
  M12 = 'M12',
}

export type F3xReportCode =
  | F3xReportCodes.Q1
  | F3xReportCodes.Q2
  | F3xReportCodes.Q3
  | F3xReportCodes.YE
  | F3xReportCodes.TER
  | F3xReportCodes.MY
  | F3xReportCodes.TwelveG
  | F3xReportCodes.TwelveP
  | F3xReportCodes.TwelveR
  | F3xReportCodes.TwelveS
  | F3xReportCodes.TwelveC
  | F3xReportCodes.ThirtyG
  | F3xReportCodes.ThirtyR
  | F3xReportCodes.ThirtyS
  | F3xReportCodes.M2
  | F3xReportCodes.M3
  | F3xReportCodes.M4
  | F3xReportCodes.M5
  | F3xReportCodes.M6
  | F3xReportCodes.M7
  | F3xReportCodes.M8
  | F3xReportCodes.M9
  | F3xReportCodes.M10
  | F3xReportCodes.M11
  | F3xReportCodes.M12;

export const monthlyElectionYearReportCodes: F3xReportCode[] = [
  F3xReportCodes.M2,
  F3xReportCodes.M3,
  F3xReportCodes.M4,
  F3xReportCodes.M5,
  F3xReportCodes.M6,
  F3xReportCodes.M7,
  F3xReportCodes.M8,
  F3xReportCodes.M9,
  F3xReportCodes.M10,
  F3xReportCodes.TwelveG,
  F3xReportCodes.ThirtyG,
  F3xReportCodes.YE,
  F3xReportCodes.TER,
];
export const monthlyNonElectionYearReportCodes: F3xReportCode[] = [
  F3xReportCodes.M2,
  F3xReportCodes.M3,
  F3xReportCodes.M4,
  F3xReportCodes.M5,
  F3xReportCodes.M6,
  F3xReportCodes.M7,
  F3xReportCodes.M8,
  F3xReportCodes.M9,
  F3xReportCodes.M10,
  F3xReportCodes.M11,
  F3xReportCodes.M12,
  F3xReportCodes.YE,
  F3xReportCodes.TER,
];
export const quarterlyElectionYearReportCodes: F3xReportCode[] = [
  F3xReportCodes.Q1,
  F3xReportCodes.Q2,
  F3xReportCodes.Q3,
  F3xReportCodes.TwelveG,
  F3xReportCodes.ThirtyG,
  F3xReportCodes.YE,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TER,
];
export const quarterlyNonElectionYearReportCodes: F3xReportCode[] = [
  F3xReportCodes.MY,
  F3xReportCodes.YE,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TER,
];

export const electionReportCodes: F3xReportCode[] = [
  F3xReportCodes.ThirtyG,
  F3xReportCodes.ThirtyR,
  F3xReportCodes.ThirtyS,
  F3xReportCodes.TwelveC,
  F3xReportCodes.TwelveG,
  F3xReportCodes.TwelveP,
  F3xReportCodes.TwelveR,
  F3xReportCodes.TwelveS,
];

export class F3xCoverageDates {
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | null = null;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | null = null;
  report_code: F3xReportCodes | null = null;
  // prettier-ignore
  static fromJSON(json: any): F3xCoverageDates { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(F3xCoverageDates, json);
  }
}

export class F3xSummary extends BaseModel implements Report {
  id: number | null = null;

  form_type: F3xFormType = F3xFormTypes.F3XT;
  filer_committee_id_number: string | null = null;
  committee_name: string | null = null;
  change_of_address: boolean | null = null;
  street_1: string | null = null;
  street_2: string | null = null;
  city: string | null = null;
  state: string | null = null;
  zip: string | null = null;
  report_code: F3xReportCode | null = null;
  election_code: string | null = null;
  @Transform(BaseModel.dateTransform) date_of_election: Date | null = null;
  state_of_election: string | null = null;
  @Transform(BaseModel.dateTransform) coverage_from_date: Date | null = null;
  @Transform(BaseModel.dateTransform) coverage_through_date: Date | null = null;
  qualified_committee: boolean | null = null;
  treasurer_last_name: string | null = null;
  treasurer_first_name: string | null = null;
  treasurer_middle_name: string | null = null;
  treasurer_prefix: string | null = null;
  treasurer_suffix: string | null = null;
  confirmation_email_1: string | null = null;
  confirmation_email_2: string | null = null;
  @Transform(BaseModel.dateTransform) date_signed: Date | null = null;

  @Type(() => UploadSubmission)
  @Transform(UploadSubmission.transform)
  upload_submission: UploadSubmission | null = null;
  @Type(() => WebPrintSubmission)
  @Transform(WebPrintSubmission.transform)
  webprint_submission: WebPrintSubmission | null = null;

  @Transform(BaseModel.dateTransform) cash_on_hand_date: Date | null = null;
  L6b_cash_on_hand_beginning_period: number | null = null;
  L6c_total_receipts_period: number | null = null;
  L6d_subtotal_period: number | null = null;
  L7_total_disbursements_period: number | null = null;
  L8_cash_on_hand_at_close_period: number | null = null;
  L9_debts_to_period: number | null = null;
  L10_debts_by_period: number | null = null;
  L11ai_itemized_period: number | null = null;
  L11aii_unitemized_period: number | null = null;
  L11aiii_total_period: number | null = null;
  L11b_political_party_committees_period: number | null = null;
  L11c_other_political_committees_pacs_period: number | null = null;
  L11d_total_contributions_period: number | null = null;
  L12_transfers_from_affiliated_other_party_cmtes_period: number | null = null;
  L13_all_loans_received_period: number | null = null;
  L14_loan_repayments_received_period: number | null = null;
  L15_offsets_to_operating_expenditures_refunds_period: number | null = null;
  L16_refunds_of_federal_contributions_period: number | null = null;
  L17_other_federal_receipts_dividends_period: number | null = null;
  L18a_transfers_from_nonfederal_account_h3_period: number | null = null;
  L18b_transfers_from_nonfederal_levin_h5_period: number | null = null;
  L18c_total_nonfederal_transfers_18a_18b_period: number | null = null;
  L19_total_receipts_period: number | null = null;
  L20_total_federal_receipts_period: number | null = null;
  L21ai_federal_share_period: number | null = null;
  L21aii_nonfederal_share_period: number | null = null;
  L21b_other_federal_operating_expenditures_period: number | null = null;
  L21c_total_operating_expenditures_period: number | null = null;
  L22_transfers_to_affiliated_other_party_cmtes_period: number | null = null;
  L23_contributions_to_federal_candidates_cmtes_period: number | null = null;
  L24_independent_expenditures_period: number | null = null;
  L25_coordinated_expend_made_by_party_cmtes_period: number | null = null;
  L26_loan_repayments_period: number | null = null;
  L27_loans_made_period: number | null = null;
  L28a_individuals_persons_period: number | null = null;
  L28b_political_party_committees_period: number | null = null;
  L28c_other_political_committees_period: number | null = null;
  L28d_total_contributions_refunds_period: number | null = null;
  L29_other_disbursements_period: number | null = null;
  L30ai_shared_federal_activity_h6_fed_share_period: number | null = null;
  L30aii_shared_federal_activity_h6_nonfed_period: number | null = null;
  L30b_nonallocable_fed_election_activity_period: number | null = null;
  L30c_total_federal_election_activity_period: number | null = null;
  L31_total_disbursements_period: number | null = null;
  L32_total_federal_disbursements_period: number | null = null;
  L33_total_contributions_period: number | null = null;
  L34_total_contribution_refunds_period: number | null = null;
  L35_net_contributions_period: number | null = null;
  L36_total_federal_operating_expenditures_period: number | null = null;
  L37_offsets_to_operating_expenditures_period: number | null = null;
  L38_net_operating_expenditures_period: number | null = null;
  L6a_cash_on_hand_jan_1_ytd: number | null = null;
  L6a_year_for_above_ytd: string | null = null;
  L6c_total_receipts_ytd: number | null = null;
  L6d_subtotal_ytd: number | null = null;
  L7_total_disbursements_ytd: number | null = null;
  L8_cash_on_hand_close_ytd: number | null = null;
  L11ai_itemized_ytd: number | null = null;
  L11aii_unitemized_ytd: number | null = null;
  L11aiii_total_ytd: number | null = null;
  L11b_political_party_committees_ytd: number | null = null;
  L11c_other_political_committees_pacs_ytd: number | null = null;
  L11d_total_contributions_ytd: number | null = null;
  L12_transfers_from_affiliated_other_party_cmtes_ytd: number | null = null;
  L13_all_loans_received_ytd: number | null = null;
  L14_loan_repayments_received_ytd: number | null = null;
  L15_offsets_to_operating_expenditures_refunds_ytd: number | null = null;
  L16_refunds_of_federal_contributions_ytd: number | null = null;
  L17_other_federal_receipts_dividends_ytd: number | null = null;
  L18a_transfers_from_nonfederal_account_h3_ytd: number | null = null;
  L18b_transfers_from_nonfederal_levin_h5_ytd: number | null = null;
  L18c_total_nonfederal_transfers_18a_18b_ytd: number | null = null;
  L19_total_receipts_ytd: number | null = null;
  L20_total_federal_receipts_ytd: number | null = null;
  L21ai_federal_share_ytd: number | null = null;
  L21aii_nonfederal_share_ytd: number | null = null;
  L21b_other_federal_operating_expenditures_ytd: number | null = null;
  L21c_total_operating_expenditures_ytd: number | null = null;
  L22_transfers_to_affiliated_other_party_cmtes_ytd: number | null = null;
  L23_contributions_to_federal_candidates_cmtes_ytd: number | null = null;
  L24_independent_expenditures_ytd: number | null = null;
  L25_coordinated_expend_made_by_party_cmtes_ytd: number | null = null;
  L26_loan_repayments_made_ytd: number | null = null;
  L27_loans_made_ytd: number | null = null;
  L28a_individuals_persons_ytd: number | null = null;
  L28b_political_party_committees_ytd: number | null = null;
  L28c_other_political_committees_ytd: number | null = null;
  L28d_total_contributions_refunds_ytd: number | null = null;
  L29_other_disbursements_ytd: number | null = null;
  L30ai_shared_federal_activity_h6_fed_share_ytd: number | null = null;
  L30aii_shared_federal_activity_h6_nonfed_ytd: number | null = null;
  L30b_nonallocable_fed_election_activity_ytd: number | null = null;
  L30c_total_federal_election_activity_ytd: number | null = null;
  L31_total_disbursements_ytd: number | null = null;
  L32_total_federal_disbursements_ytd: number | null = null;
  L33_total_contributions_ytd: number | null = null;
  L34_total_contribution_refunds_ytd: number | null = null;
  L35_net_contributions_ytd: number | null = null;
  L36_total_federal_operating_expenditures_ytd: number | null = null;
  L37_offsets_to_operating_expenditures_ytd: number | null = null;
  L38_net_operating_expenditures_ytd: number | null = null;

  @Type(() => Date)
  @Transform(BaseModel.dateTransform) created: Date | null = null;
  @Type(() => Date)
  @Transform(BaseModel.dateTransform) updated: Date | null = null;
  deleted: string | null = null;

  // prettier-ignore
  static fromJSON(json: any): F3xSummary { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(F3xSummary, json);
  }
}
