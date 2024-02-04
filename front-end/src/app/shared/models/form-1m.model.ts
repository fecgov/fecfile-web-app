import { Report, ReportTypes } from './report.model';
import { plainToInstance, Transform, Type } from 'class-transformer';
import { BaseModel } from './base.model';
import { CandidateOfficeType, Contact } from './contact.model';
import { schema as f1mSchema } from 'fecfile-validate/fecfile_validate_js/dist/F1M';

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
  schema = f1mSchema;
  report_type = ReportTypes.F1M;
  form_type = F1MFormTypes.F1MN;
  override submitAlertText =
    'Are you sure you want to submit this form electronically? Please note that you cannot undo this action.';

  get formLabel() {
    return 'FORM 1M';
  }

  get formSubLabel() {
    return 'NOTIFICATION OF MULTICANDIDATE STATUS';
  }

  get versionLabel() {
    return `${F1MFormVersionLabels[this.form_type]} ${this.report_version ?? ''}`.trim();
  }

  committee_name?: string;
  street_1?: string;
  street_2?: string;
  city?: string;
  state?: string;
  zip?: string;
  committee_type?: CommitteeType;

  @Transform(BaseModel.dateTransform) affiliated_date_form_f1_filed?: Date;
  affiliated_committee_fec_id?: string;
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

  @Transform(BaseModel.dateTransform) date_of_original_registration?: Date;
  @Transform(BaseModel.dateTransform) date_of_51st_contributor?: Date;
  @Transform(BaseModel.dateTransform) date_committee_met_requirements?: Date;
  treasurer_last_name?: string;
  treasurer_first_name?: string;
  treasurer_middle_name?: string;
  treasurer_prefix?: string;
  treasurer_suffix?: string;
  @Transform(BaseModel.dateTransform) date_signed?: Date;

  @Type(() => Contact) contact_affiliated?: Contact;
  contact_affiliated_id?: string | null;
  @Type(() => Contact) contact_candidate_I?: Contact;
  contact_candidate_I_id?: string | null;
  @Type(() => Contact) contact_candidate_II?: Contact;
  contact_candidate_II_id?: string | null;
  @Type(() => Contact) contact_candidate_III?: Contact;
  contact_candidate_III_id?: string | null;
  @Type(() => Contact) contact_candidate_IV?: Contact;
  contact_candidate_IV_id?: string | null;
  @Type(() => Contact) contact_candidate_V?: Contact;
  contact_candidate_V_id?: string | null;

  // prettier-ignore
  static fromJSON(json: any): Form1M { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToInstance(Form1M, json);
  }
}
