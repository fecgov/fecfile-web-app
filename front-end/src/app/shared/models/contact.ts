import { plainToClass, Expose } from 'class-transformer';
import { BaseModel } from './base-model';

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
  @Expose() type: ContactType = ContactTypes.INDIVIDUAL;
  @Expose() candidate_id: string | null = null;
  @Expose() committee_id: string | null = null;
  @Expose() name: string | null = null;
  @Expose() last_name: string | null = null;
  @Expose() first_name: string | null = null;
  @Expose() middle_name: string | null = null;
  @Expose() prefix: string | null = null;
  @Expose() suffix: string | null = null;
  @Expose() street_1: string = '';
  @Expose() street_2: string | null = null;
  @Expose() city: string = '';
  @Expose() state: string = '';
  @Expose() zip: string = '';
  @Expose() employer: string | null = null;
  @Expose() occupation: string | null = null;
  @Expose() candidate_office: CandidateOfficeType | null = null;
  @Expose() candidate_state: string | null = null;
  @Expose() candidate_district: string | null = null;
  @Expose() telephone: string | null = null;
  @Expose() country: string = '';

  // created, updated, deleted ???

  static getInstance(json: any): Contact {
    return plainToClass(Contact, json, { excludeExtraneousValues: true });
  }
}
