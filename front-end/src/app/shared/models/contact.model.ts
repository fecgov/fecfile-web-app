import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';

export enum ContactTypes {
  CANDIDATE = 'cand',
  COMMITTEE = 'com',
  INDIVIDUAL = 'ind',
  ORGANIZATION = 'org',
}

export type ContactType =
  | ContactTypes.CANDIDATE
  | ContactTypes.COMMITTEE
  | ContactTypes.INDIVIDUAL
  | ContactTypes.ORGANIZATION;

export enum CandidateOfficeTypes {
  HOUSE = 'house',
  PRESIDENTIAL = 'pres',
  SENATE = 'senate',
}

export type CandidateOfficeType =
  | CandidateOfficeTypes.HOUSE
  | CandidateOfficeTypes.PRESIDENTIAL
  | CandidateOfficeTypes.SENATE;

export class Contact extends BaseModel {
  id: number = 0;
  type: ContactType = ContactTypes.INDIVIDUAL;
  candidate_id: string | null = null;
  committee_id: string | null = null;
  name: string | null = null;
  last_name: string | null = null;
  first_name: string | null = null;
  middle_name: string | null = null;
  prefix: string | null = null;
  suffix: string | null = null;
  street_1: string = '';
  street_2: string | null = null;
  city: string = '';
  state: string = '';
  zip: string = '';
  employer: string | null = null;
  occupation: string | null = null;
  candidate_office: CandidateOfficeType | null = null;
  candidate_state: string | null = null;
  candidate_district: string | null = null;
  telephone: string | null = null;
  country: string = '';

  // created, updated, deleted ???

  static getInstance(json: any): Contact {
    return plainToClass(Contact, json);
  }
}
