import type { LabelList } from 'app/shared/utils/label.utils';

export const ContactTypes = {
  CANDIDATE: 'CAN',
  COMMITTEE: 'COM',
  INDIVIDUAL: 'IND',
  ORGANIZATION: 'ORG',
} as const;
export type ContactTypes = (typeof ContactTypes)[keyof typeof ContactTypes];

export const ContactTypeLabels: LabelList = [
  [ContactTypes.INDIVIDUAL, 'Individual'],
  [ContactTypes.CANDIDATE, 'Candidate'],
  [ContactTypes.COMMITTEE, 'Committee'],
  [ContactTypes.ORGANIZATION, 'Organization'],
];

export function isEntity(type: ContactTypes) {
  return type === ContactTypes.COMMITTEE || type === ContactTypes.ORGANIZATION;
}
export function isPerson(type: ContactTypes) {
  return type === ContactTypes.CANDIDATE || type === ContactTypes.INDIVIDUAL;
}
export function hasFecId(type: ContactTypes) {
  return type === ContactTypes.CANDIDATE || type === ContactTypes.COMMITTEE;
}

export enum CandidateOfficeTypes {
  HOUSE = 'H',
  PRESIDENTIAL = 'P',
  SENATE = 'S',
}

export type CandidateOfficeType =
  | CandidateOfficeTypes.HOUSE
  | CandidateOfficeTypes.PRESIDENTIAL
  | CandidateOfficeTypes.SENATE;

export const CandidateOfficeTypeLabels: LabelList = [
  [CandidateOfficeTypes.HOUSE, 'House'],
  [CandidateOfficeTypes.PRESIDENTIAL, 'Presidential'],
  [CandidateOfficeTypes.SENATE, 'Senate'],
];

export enum ContactFields {
  type = 'Type',
  candidate_id = 'Candidate Id',
  committee_id = 'Committee Id',
  name = 'Name',
  last_name = 'Last Name',
  first_name = 'First Name',
  middle_name = 'Middle Name',
  prefix = 'Prefix',
  suffix = 'Suffix',
  street_1 = 'Street Address',
  street_2 = 'Apartment, Suite, Etc.',
  city = 'City',
  state = 'State/Territory',
  zip = 'Zip/Postal Code',
  employer = 'Employer',
  occupation = 'Occupation',
  candidate_office = 'Candidate Office',
  candidate_state = 'Candidate State',
  candidate_district = 'Candidate District',
  telephone = 'Telephone',
  country = 'Country',
}
