import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';
import { LabelList } from '../utils/label.utils';

export enum ContactTypes {
  CANDIDATE = 'CAN',
  COMMITTEE = 'COM',
  INDIVIDUAL = 'IND',
  ORGANIZATION = 'ORG',
}

export type ContactType =
  | ContactTypes.CANDIDATE
  | ContactTypes.COMMITTEE
  | ContactTypes.INDIVIDUAL
  | ContactTypes.ORGANIZATION;

export const ContactTypeLabels: LabelList = [
  [ContactTypes.INDIVIDUAL, 'Individual'],
  [ContactTypes.CANDIDATE, 'Candidate'],
  [ContactTypes.COMMITTEE, 'Committee'],
  [ContactTypes.ORGANIZATION, 'Organization'],
];

export enum CandidateOfficeTypes {
  HOUSE = 'H',
  PRESIDENTIAL = 'P',
  SENATE = 'S',
}

export type CandidateOfficeType =
  | CandidateOfficeTypes.HOUSE
  | CandidateOfficeTypes.PRESIDENTIAL
  | CandidateOfficeTypes.SENATE;

export const CandidateOfficeTypeLabels = [
  [CandidateOfficeTypes.HOUSE, 'House'],
  [CandidateOfficeTypes.PRESIDENTIAL, 'Presidential'],
  [CandidateOfficeTypes.SENATE, 'Senate'],
];

export class Contact extends BaseModel {
  id: number | null = null;
  type: ContactType = ContactTypes.INDIVIDUAL;
  candidate_id: string | null = null;
  committee_id: string | null = null;
  name: string | null = null;
  last_name: string | null = null;
  first_name: string | null = null;
  middle_name: string | null = null;
  prefix: string | null = null;
  suffix: string | null = null;
  street_1 = '';
  street_2: string | null = null;
  city = '';
  state = '';
  zip = '';
  employer: string | null = null;
  occupation: string | null = null;
  candidate_office: CandidateOfficeType | null = null;
  candidate_state: string | null = null;
  candidate_district: string | null = null;
  telephone: string | null = null;
  country = '';
  created: string | null = null;
  updated: string | null = null;
  deleted: string | null = null;

  // prettier-ignore
  static fromJSON(json: any): Contact { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Contact, json);
  }

  static getFieldsByType(type: ContactType): string[] {
    if (type === ContactTypes.INDIVIDUAL) {
      return [
        'type',
        'last_name',
        'first_name',
        'middle_name',
        'prefix',
        'suffix',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'employer',
        'occupation',
        'created',
        'updated',
        'deleted',
      ];
    }

    if (type === ContactTypes.ORGANIZATION) {
      return [
        'type',
        'name',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'created',
        'updated',
        'deleted',
      ];
    }

    if (type === ContactTypes.CANDIDATE) {
      return [
        'type',
        'candidate_id',
        'last_name',
        'first_name',
        'middle_name',
        'prefix',
        'suffix',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'employer',
        'occupation',
        'candidate_office',
        'candidate_state',
        'candidate_district',
        'created',
        'updated',
        'deleted',
      ];
    }

    if (type === ContactTypes.COMMITTEE) {
      return [
        'type',
        'committee_id',
        'name',
        'country',
        'street_1',
        'street_2',
        'city',
        'state',
        'zip',
        'telephone',
        'created',
        'updated',
        'deleted',
      ];
    }

    return [];
  }
}
