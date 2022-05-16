import { BaseModel } from './base.model';
import { Transaction } from '../interfaces/transaction.interface';
import { plainToClass } from 'class-transformer';
// import { DateUtils } from '../utils/date.utils';

export class SchATransaction extends BaseModel implements Transaction {
  id: number | null = null;

  form_type: string | null = null;
  filer_committee_id_number: string | null = null;
  transaction_id: string | null = null;
  back_reference_tran_id_number: string | null = null;
  back_reference_sched_name: string | null = null;
  entity_type: string | null = null;
  contributor_organization_name: string | null = null;
  contributor_last_name: string | null = null;
  contributor_first_name: string | null = null;
  contributor_middle_name: string | null = null;
  contributor_prefix: string | null = null;
  contributor_suffix: string | null = null;
  contributor_street_1: string | null = null;
  contributor_street_2: string | null = null;
  contributor_city: string | null = null;
  contributor_state: string | null = null;
  contributor_zip: string | null = null;
  election_code: string | null = null;
  election_other_description: string | null = null;
  contribution_date: string | null = null;
  contribution_amount: number | null = null;
  contribution_aggregate: number | null = null;
  contribution_purpose_descrip: string | null = null;
  contributor_employer: string | null = null;
  contributor_occupation: string | null = null;
  donor_committee_fec_id: string | null = null;
  donor_committee_name: string | null = null;
  donor_candidate_fec_id: string | null = null;
  donor_candidate_last_name: string | null = null;
  donor_candidate_first_name: string | null = null;
  donor_candidate_middle_name: string | null = null;
  donor_candidate_prefix: string | null = null;
  donor_candidate_suffix: string | null = null;
  donor_candidate_office: string | null = null;
  donor_candidate_state: string | null = null;
  donor_candidate_district: string | null = null;
  conduit_name: string | null = null;
  conduit_street1: string | null = null;
  conduit_street2: string | null = null;
  conduit_city: string | null = null;
  conduit_state: string | null = null;
  conduit_zip: string | null = null;
  memo_code: boolean | null = null;
  memo_text_description: string | null = null;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | null = null;
  transaction_type_identifier: string | null = null;

  created: string | null = null;
  updated: string | null = null;
  deleted: string | null = null;

  report_id: number | null = null; // Foreign key to the F3XSummary model

  // prettier-ignore
  static fromJSON(json: any): SchATransaction { // eslint-disable-line @typescript-eslint/no-explicit-any
    // if (json.contribution_date) {
    //   json.contribution_date = DateUtils.convertFecFormatToDate(json.contribution_date);
    // }
    return plainToClass(SchATransaction, json);
  }
}
