import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export class Candidate extends BaseModel {
  active_through: number | undefined;
  address_city: string | undefined;
  address_state: string | undefined;
  address_street_1: string | undefined;
  address_street_2: string | undefined;
  address_zip: string | undefined;
  candidate_first_name: string | undefined;
  candidate_id: string | undefined;
  candidate_inactive: boolean | undefined;
  candidate_last_name: string | undefined;
  candidate_middle_name: string | undefined;
  candidate_prefix: string | undefined;
  candidate_status: string | undefined;
  candidate_suffix: string | undefined;
  cycles: number[] = [];
  district: string | undefined;
  district_number: number | undefined;
  election_districts: string[] = [];
  election_years: number[] = [];
  federal_funds_flag: boolean | undefined;
  first_file_date: string | undefined;
  flags: string | undefined;
  has_raised_funds: boolean | undefined;
  incumbent_challenge: string | undefined;
  incumbent_challenge_full: string | undefined;
  last_f2_date: string | undefined;
  last_file_date: string | undefined;
  load_date: string | undefined;
  name: string | undefined;
  office: string | undefined;
  office_full: string | undefined;
  party: string | undefined;
  party_full: string | undefined;
  state: string | undefined;

  // prettier-ignore
  static fromJSON(json: any): Candidate { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Candidate, json);
  }
}
