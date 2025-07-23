import { BehaviorSubject } from 'rxjs';

export enum ContactTypes {
  CANDIDATE = 'CAN',
  COMMITTEE = 'COM',
  INDIVIDUAL = 'IND',
  ORGANIZATION = 'ORG',
}

export interface MockContact {
  type: ContactTypes;
  committee_id?: string;
  name?: string;
  last_name?: string;
  first_name?: string;
  middle_name?: string | null;
  prefix?: string | null;
  suffix?: string | null;
  candidate_id?: string;
  candidate_office?: string;
  candidate_state?: string | null;
  candidate_district?: string | null;
  street_1: string;
  street_2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  telephone: string | null;
}

const address_fields = {
  street_1: '1234 Test Ln',
  street_2: null,
  city: 'Testville',
  state: 'AK',
  zip: '12345',
  country: 'USA',
  telephone: null,
};

const eo_fields = {
  employer: 'E',
  occupation: 'O',
};

const name_optionals = {
  middle_name: null,
  prefix: null,
  suffix: null,
};

export const Individual_A_A$ = new BehaviorSubject<any>(undefined);
export const Individual_A_A = {
  type: 'IND',
  last_name: 'Ant',
  first_name: 'Accidental',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Individual_B_B$ = new BehaviorSubject<any>(undefined);
export const Individual_B_B = {
  type: 'IND',
  last_name: 'Bat',
  first_name: 'Bouncy',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Individual_C_C = {
  type: 'IND',
  last_name: 'Cat',
  first_name: 'Careful',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Individual_D_D = {
  type: 'IND',
  last_name: 'Dog',
  first_name: 'Diggory',
  ...name_optionals,
  ...address_fields,
  ...eo_fields,
};

export const Candidate_Presidential_A = {
  type: 'CAN',
  candidate_id: 'P00000001',
  candidate_office: 'P',
  candidate_state: null,
  candidate_district: null,
  first_name: 'Apple',
  last_name: 'President',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_Presidential_B = {
  type: 'CAN',
  candidate_id: 'P00000002',
  candidate_office: 'P',
  candidate_state: null,
  candidate_district: null,
  first_name: 'Bat',
  last_name: 'President',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_Senate_A = {
  type: 'CAN',
  candidate_id: 'S1AK00001',
  candidate_office: 'S',
  candidate_state: 'AK',
  candidate_district: null,
  first_name: 'Alpha',
  last_name: 'Senate',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_Senate_B = {
  type: 'CAN',
  candidate_id: 'S1AK00002',
  candidate_office: 'S',
  candidate_state: 'AK',
  candidate_district: null,
  first_name: 'Beta',
  last_name: 'Senate',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_House_A$ = new BehaviorSubject<any>(undefined);
export const Candidate_House_A = {
  type: 'CAN',
  candidate_id: 'H1AK00001',
  candidate_office: 'H',
  candidate_state: 'AK',
  candidate_district: '00',
  first_name: 'Aleph',
  last_name: 'House',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Candidate_House_B = {
  type: 'CAN',
  candidate_id: 'H1AK00002',
  candidate_office: 'H',
  candidate_state: 'AK',
  candidate_district: '00',
  first_name: 'Beth',
  last_name: 'House',
  ...address_fields,
  ...name_optionals,
  ...eo_fields,
};

export const Committee_A$ = new BehaviorSubject<any>(undefined);
export const Committee_A = {
  type: 'COM',
  committee_id: 'C00000001',
  name: 'Committee A',
  ...address_fields,
};

export const Committee_B = {
  type: 'COM',
  committee_id: 'C00000002',
  name: 'Committee B',
  ...address_fields,
};

export const Organization_A$ = new BehaviorSubject<any>(undefined);
export const Organization_A: MockContact = {
  type: ContactTypes.ORGANIZATION,
  name: 'Organization A',
  ...address_fields,
};

export const Organization_B: MockContact = {
  type: ContactTypes.ORGANIZATION,
  name: 'Organization B',
  ...address_fields,
};

export function clearContacts() {
  Individual_A_A$.next(undefined);
  Organization_A$.next(undefined);
  Committee_A$.next(undefined);
  Candidate_House_A$.next(undefined);
}
