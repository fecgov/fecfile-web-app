import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class CommitteeAccount extends BaseModel {
  id: string | undefined;
  custodian_city: string | undefined;
  zip: string | undefined;
  treasurer_phone: string | undefined;
  party_full: string | undefined;
  fax: string | undefined;
  first_f1_date: string | undefined;
  committee_type: string | undefined;
  custodian_state: string | undefined;
  custodian_name_suffix: string | undefined;
  treasurer_name_suffix: string | undefined;
  designation: string | undefined;
  treasurer_name_middle: string | undefined;
  party_type_full: string | undefined;
  treasurer_name_title: string | undefined;
  custodian_name_1: string | undefined;
  custodian_name_2: string | undefined;
  treasurer_name_prefix: string | undefined;
  treasurer_zip: string | undefined;
  custodian_street_1: string | undefined;
  state: string | undefined;
  first_file_date: string | undefined;
  street_1: string | undefined;
  lobbyist_registrant_pac: string | undefined;
  email: string | undefined;
  city: string | undefined;
  treasurer_state: string | undefined;
  party_type: string | undefined;
  treasurer_city: string | undefined;
  custodian_name_title: string | undefined;
  custodian_name_full: string | undefined;
  treasurer_name_1: string | undefined;
  treasurer_name: string | undefined;
  filing_frequency: string | undefined;
  committee_id: string | undefined;
  treasurer_name_2: string | undefined;
  name: string | undefined;
  organization_type: string | undefined;
  custodian_phone: string | undefined;
  form_type: string | undefined;
  custodian_street_2: string | undefined;
  last_f1_date: string | undefined;
  designation_full: string | undefined;
  custodian_name_middle: string | undefined;
  committee_type_full: string | undefined;
  leadership_pac: string | undefined;
  candidate_ids: string[] = [];
  custodian_name_prefix: string | undefined;
  street_2: string | undefined;
  party: string | undefined;
  organization_type_full: string | undefined;
  last_file_date: string | undefined;
  treasurer_street_2: string | undefined;
  treasurer_street_1: string | undefined;
  sponsor_candidate_ids: string[] = [];
  state_full: string | undefined;
  custodian_zip: string | undefined;
  affiliated_committee_name: string | undefined;
  website: string | undefined;
  cycles: number[] = [];

  // prettier-ignore
  static fromJSON(json: any): CommitteeAccount { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeAccount, json);
  }
}

export function isPAC(committee_type?: string): boolean {
  if (!committee_type) return false;
  return PAC.includes(committee_type);
}

export function isPTY(committee_type?: string, designation?: string): boolean {
  if (!committee_type || !designation) return false;
  if (committee_type === 'Y') return true;
  return committee_type === 'X' && designation !== 'U';
}

const PAC = ['O', 'U', 'D', 'N', 'Q', 'V', 'W'];
