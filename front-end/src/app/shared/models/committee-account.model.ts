import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';
import { LabelList } from '../utils/label.utils';

export enum CommitteeDesignations {
  PRINCIPLE_CAMPAIGN_COMMITTEE = 'P',
  AUTHORIZED_COMMITTEE = 'A',
  JOINT_FUNDRAISER_COMMITTEE = 'J',
  UNAUTHORIZED_COMMITTEE = 'U',
  LOBBYIST_REGISTRANT_PAC = 'B',
  LEADERSHIP_PAC = 'D',
}

export type CommitteeDesignation =
  | CommitteeDesignations.PRINCIPLE_CAMPAIGN_COMMITTEE
  | CommitteeDesignations.AUTHORIZED_COMMITTEE
  | CommitteeDesignations.JOINT_FUNDRAISER_COMMITTEE
  | CommitteeDesignations.UNAUTHORIZED_COMMITTEE
  | CommitteeDesignations.LOBBYIST_REGISTRANT_PAC
  | CommitteeDesignations.LEADERSHIP_PAC;

export const CommitteeDesignationLabels: LabelList = [
  [CommitteeDesignations.PRINCIPLE_CAMPAIGN_COMMITTEE, 'Principal Campaign Committee (PCC) - Form 1 line 5(a)'],
  [CommitteeDesignations.AUTHORIZED_COMMITTEE, 'Authorized Committee - Form 1 line 5(b)'],
  [CommitteeDesignations.JOINT_FUNDRAISER_COMMITTEE, 'Joint Fundraiser Committee - Form 1 line 5(g) or 5(h)'],
  [CommitteeDesignations.UNAUTHORIZED_COMMITTEE, 'Unauthorized Committee'],
  [
    CommitteeDesignations.LOBBYIST_REGISTRANT_PAC,
    'Lobbyist/Registrant PAC - Form 1 line 5(e) last box or 5(f) 2nd box',
  ],
  [CommitteeDesignations.LEADERSHIP_PAC, 'Leadership PAC - Form 1 line 5(f) 3rd box'],
];


export class CommitteeAccount extends BaseModel {
  custodian_city: string | null = null;
  zip: string | null = null;
  treasurer_phone: string | null = null;
  party_full: string | null = null;
  fax: string | null = null;
  first_f1_date: string | null = null;
  committee_type: string | null = null;
  custodian_state: string | null = null;
  custodian_name_suffix: string | null = null;
  treasurer_name_suffix: string | null = null;
  designation: string | null = null;
  treasurer_name_middle: string | null = null;
  party_type_full: string | null = null;
  treasurer_name_title: string | null = null;
  custodian_name_1: string | null = null;
  custodian_name_2: string | null = null;
  treasurer_name_prefix: string | null = null;
  treasurer_zip: string | null = null;
  custodian_street_1: string | null = null;
  state: string | null = null;
  first_file_date: string | null = null;
  street_1: string | null = null;
  lobbyist_registrant_pac: string | null = null;
  email: string | null = null;
  city: string | null = null;
  treasurer_state: string | null = null;
  party_type: string | null = null;
  treasurer_city: string | null = null;
  custodian_name_title: string | null = null;
  custodian_name_full: string | null = null;
  treasurer_name_1: string | null = null;
  treasurer_name: string | null = null;
  filing_frequency: string | null = null;
  committee_id: string | null = null;
  treasurer_name_2: string | null = null;
  name: string | null = null;
  organization_type: string | null = null;
  custodian_phone: string | null = null;
  form_type: string | null = null;
  custodian_street_2: string | null = null;
  last_f1_date: string | null = null;
  designation_full: string | null = null;
  custodian_name_middle: string | null = null;
  committee_type_full: string | null = null;
  leadership_pac: string | null = null;
  candidate_ids: string[] | null = null;
  custodian_name_prefix: string | null = null;
  street_2: string | null = null;
  party: string | null = null;
  organization_type_full: string | null = null;
  last_file_date: string | null = null;
  treasurer_street_2: string | null = null;
  treasurer_street_1: string | null = null;
  sponsor_candidate_ids: string[] | null = null;
  state_full: string | null = null;
  custodian_zip: string | null = null;
  affiliated_committee_name: string | null = null;
  website: string | null = null;
  cycles:  number[] | null = null;

  static fromJSON(json: any): CommitteeAccount {
    return plainToClass(CommitteeAccount, json);
  }
}
