import { LabelList } from '../../utils/label.utils';
import { BaseModel } from '../base.model';

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

export abstract class Contact extends BaseModel {
  id: string | undefined;
  abstract type: ContactTypes;
  street_1 = '';
  street_2: string | undefined;
  city = '';
  state = '';
  zip = '';
  telephone: string | undefined;
  country = 'USA';
  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;
  has_transaction_or_report = false;

  abstract getNameString(): string;
}

export abstract class FullNameContact extends Contact {
  last_name: string | undefined;
  first_name: string | undefined;
  middle_name: string | undefined;
  prefix: string | undefined;
  suffix: string | undefined;
  employer: string | undefined;
  occupation: string | undefined;

  getNameString(): string {
    return `${this.last_name}, ${this.first_name} ${this.middle_name ?? ''}`;
  }
}

export abstract class SimpleNameContact extends Contact {
  name: string | undefined;

  getNameString(): string {
    return this.name ?? '';
  }
}

export function fullNameContact(contact: Contact): contact is FullNameContact {
  return contact instanceof FullNameContact;
}

/**
 * The following maps have:
 * KEY = the key to a templateMap entry for the transaction forms
 * VALUE = the key to the contact field
 */
export const STANDARD_SINGLE_CONTACT = {
  contact_1: {
    organization_name: 'name',
    committee_name: 'name',
    committee_fec_id: 'committee_id',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
    employer: 'employer',
    occupation: 'occupation',
  },
};

export const STANDARD_AND_CANDIDATE = {
  contact_1: {
    organization_name: 'name',
    committee_name: 'name',
    committee_fec_id: 'committee_id',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
    employer: 'employer',
    occupation: 'occupation',
  },
  contact_2: {
    candidate_fec_id: 'candidate_id',
    candidate_last_name: 'last_name',
    candidate_first_name: 'first_name',
    candidate_middle_name: 'middle_name',
    candidate_prefix: 'prefix',
    candidate_suffix: 'suffix',
    candidate_office: 'candidate_office',
    candidate_state: 'candidate_state',
    candidate_district: 'candidate_district',
  },
};

export const STANDARD_AND_SECONDARY = {
  contact_1: {
    organization_name: 'name',
    committee_name: 'name',
    committee_fec_id: 'committee_id',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
    employer: 'employer',
    occupation: 'occupation',
  },
  contact_2: {
    secondary_name: 'name',
    secondary_street_1: 'street_1',
    secondary_street_2: 'street_2',
    secondary_city: 'city',
    secondary_state: 'state',
    secondary_zip: 'zip',
  },
};

export const STANDARD_AND_TERTIARY = {
  contact_1: {
    organization_name: 'name',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
    employer: 'employer',
    occupation: 'occupation',
  },
  contact_3: {
    committee_name: 'name',
    committee_fec_id: 'committee_id',
  },
};

export const STANDARD_AND_CANDIDATE_AND_SHORT_COMMITTEE = {
  contact_1: {
    organization_name: 'name',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
    employer: 'employer',
    occupation: 'occupation',
  },
  contact_2: {
    candidate_fec_id: 'candidate_id',
    candidate_last_name: 'last_name',
    candidate_first_name: 'first_name',
    candidate_middle_name: 'middle_name',
    candidate_prefix: 'prefix',
    candidate_suffix: 'suffix',
    candidate_office: 'candidate_office',
    candidate_state: 'candidate_state',
    candidate_district: 'candidate_district',
  },
  contact_3: {
    committee_name: 'name',
    committee_fec_id: 'committee_id',
  },
};

export const CONTACTS_ONE_THROUGH_FIVE = {
  contact_1: {
    organization_name: 'name',
    last_name: 'last_name',
    first_name: 'first_name',
    middle_name: 'middle_name',
    prefix: 'prefix',
    suffix: 'suffix',
    street_1: 'street_1',
    street_2: 'street_2',
    city: 'city',
    state: 'state',
    zip: 'zip',
  },
  contact_2: {
    candidate_fec_id: 'candidate_id',
    candidate_last_name: 'last_name',
    candidate_first_name: 'first_name',
    candidate_middle_name: 'middle_name',
    candidate_prefix: 'prefix',
    candidate_suffix: 'suffix',
    candidate_office: 'candidate_office',
    candidate_state: 'candidate_state',
    candidate_district: 'candidate_district',
  },
  contact_3: {
    committee_name: 'name',
    committee_fec_id: 'committee_id',
  },
  contact_4: {
    quaternary_committee_fec_id: 'committee_id',
    quaternary_committee_name: 'name',
  },
  contact_5: {
    quinary_committee_fec_id: 'committee_id',
    quinary_committee_name: 'name',
    quinary_street_1: 'street_1',
    quinary_street_2: 'street_2',
    quinary_city: 'city',
    quinary_state: 'state',
    quinary_zip: 'zip',
  },
};
