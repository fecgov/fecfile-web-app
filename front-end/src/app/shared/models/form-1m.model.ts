import { Report, ReportTypes } from './report.model';
import { Transform } from 'class-transformer';
import { BaseModel } from './base.model';
import { CandidateOfficeType } from './contact.model';

export enum CommitteeTypes {
  STATE_PTY = 'X',
  OTHER = 'N',
}
export enum F1MFormTypes {
  F1MN = 'F1MN',
  F1MA = 'F1MA',
}

export const F1MFormVersionLabels: { [key in F1MFormTypes]: string } = {
  [F1MFormTypes.F1MN]: 'Original',
  [F1MFormTypes.F1MA]: 'Amendment',
};

export type CommitteeType = CommitteeTypes.STATE_PTY | CommitteeTypes.OTHER;

export class Form1M extends Report {
  override report_type = ReportTypes.F1M;
  override form_type = F1MFormTypes.F1MN;
  get formLabel() {
    return 'FORM 1M';
  }
  get versionLabel() {
    return F1MFormVersionLabels[this.form_type] ?? '';
  }
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  committee_type?: CommitteeType;

  @Transform(BaseModel.dateTransform) affiliated_date_form_f1_filed?: Date;
  @Transform(BaseModel.dateTransform) affiliated_date_committee_fec_id?: Date;
  affiliated_committee_name?: string;

  I_candidate_id_number?: string;
  I_candidate_last_name?: string;
  I_candidate_first_name?: string;
  I_candidate_middle_name?: string;
  I_candidate_prefix?: string;
  I_candidate_suffix?: string;
  I_candidate_office?: CandidateOfficeType;
  I_candidate_state?: string;
  I_candidate_district?: string;
  @Transform(BaseModel.dateTransform) I_date_of_contribution?: Date;

  II_candidate_id_number?: string;
  II_candidate_last_name?: string;
  II_candidate_first_name?: string;
  II_candidate_middle_name?: string;
  II_candidate_prefix?: string;
  II_candidate_suffix?: string;
  II_candidate_office?: CandidateOfficeType;
  II_candidate_state?: string;
  II_candidate_district?: string;
  @Transform(BaseModel.dateTransform) II_date_of_contribution?: Date;

  III_candidate_id_number?: string;
  III_candidate_last_name?: string;
  III_candidate_first_name?: string;
  III_candidate_middle_name?: string;
  III_candidate_prefix?: string;
  III_candidate_suffix?: string;
  III_candidate_office?: CandidateOfficeType;
  III_candidate_state?: string;
  III_candidate_district?: string;
  @Transform(BaseModel.dateTransform) III_date_of_contribution?: Date;

  IV_candidate_id_number?: string;
  IV_candidate_last_name?: string;
  IV_candidate_first_name?: string;
  IV_candidate_middle_name?: string;
  IV_candidate_prefix?: string;
  IV_candidate_suffix?: string;
  IV_candidate_office?: CandidateOfficeType;
  IV_candidate_state?: string;
  IV_candidate_district?: string;
  @Transform(BaseModel.dateTransform) IV_date_of_contribution?: Date;

  V_candidate_id_number?: string;
  V_candidate_last_name?: string;
  V_candidate_first_name?: string;
  V_candidate_middle_name?: string;
  V_candidate_prefix?: string;
  V_candidate_suffix?: string;
  V_candidate_office?: CandidateOfficeType;
  V_candidate_state?: string;
  V_candidate_district?: string;
  @Transform(BaseModel.dateTransform) V_date_of_contribution?: Date;
}
