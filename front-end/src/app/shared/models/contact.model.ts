import { plainToClass } from 'class-transformer';
import { SelectItem, SelectItemGroup } from 'primeng/api';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';

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
  state = 'State/Province',
  zip = 'Zip/Postal Code',
  employer = 'Employer',
  occupation = 'Occupation',
  candidate_office = 'Candidate Office',
  candidate_state = 'Candidate State',
  candidate_district = 'Candidate District',
  telephone = 'Telephone',
  country = 'Country',
}

export class Contact extends BaseModel {
  id: string | undefined;
  type: ContactType = ContactTypes.INDIVIDUAL;
  candidate_id: string | undefined;
  committee_id: string | undefined;
  name: string | undefined;
  last_name: string | undefined;
  first_name: string | undefined;
  middle_name: string | undefined;
  prefix: string | undefined;
  suffix: string | undefined;
  street_1 = '';
  street_2: string | undefined;
  city = '';
  state = '';
  zip = '';
  employer: string | undefined;
  occupation: string | undefined;
  candidate_office: CandidateOfficeType | undefined;
  candidate_state: string | undefined;
  candidate_district: string | undefined;
  telephone: string | undefined;
  country = '';
  created: string | undefined;
  updated: string | undefined;
  deleted: string | undefined;
  transaction_count: number | undefined;
  report_count: number | undefined;

  // prettier-ignore
  static fromJSON(json: any): Contact { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Contact, json);
  }

  getNameString(): string {
    return this.name ? this.name : `${this.last_name}, ${this.first_name} ${this.middle_name ?? ''}`;
  }
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

// For Schedule E transactions whose candidate is in a presidential
// primary, we allow the user to save the candidate_state to the transaction
// record but do not update the contact record of the candidate with the
// candidate_state selected. The definition below is the same as the
// STANDARD_AND_CANDIDATE except the candidate_state has been removed.
export const STANDARD_AND_CANDIDATE_PRESIDENTIAL_PRIMARY = {
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

export const STANDARD_AND_SECONDARY_AND_TERTIARY = {
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
    secondary_name: 'name',
    secondary_street_1: 'street_1',
    secondary_street_2: 'street_2',
    secondary_city: 'city',
    secondary_state: 'state',
    secondary_zip: 'zip',
  },
  contact_3: {
    committee_name: 'name',
    committee_fec_id: 'committee_id',
  },
};

export class FecApiLookupData {}

export class FecApiCandidateLookupData extends FecApiLookupData {
  candidate_id: string | undefined;
  office: string | undefined;
  name: string | undefined;

  constructor(data: FecApiCandidateLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<FecApiCandidateLookupData> {
    return {
      // TODO: Will need to update this to last/first name fields
      // when FEC updates their candidate API to add those fields
      label: `${this.name} (${this.candidate_id})`,
      value: this,
    };
  }
}

export class FecfileCandidateLookupData extends Contact {
  constructor(data: FecfileCandidateLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<Contact> {
    return {
      label: `${this.last_name}, ${this.first_name} (${this.candidate_id})`,
      value: this,
    };
  }
}

export class CandidateLookupResponse {
  fec_api_candidates?: FecApiCandidateLookupData[];
  fecfile_candidates?: FecfileCandidateLookupData[];

  // prettier-ignore
  static fromJSON(json: any): CandidateLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CandidateLookupResponse, json);
  }

  toSelectItemGroups(includeFecfileResults: boolean): SelectItemGroup[] {
    const fecApiSelectItems =
      this.fec_api_candidates?.map((data) => new FecApiCandidateLookupData(data).toSelectItem()) || [];
    const fecfileSelectItems =
      this.fecfile_candidates?.map((data) => new FecfileCandidateLookupData(data).toSelectItem()) || [];
    return [
      ...(includeFecfileResults
        ? [
            {
              label: fecfileSelectItems.length
                ? 'Select an existing candidate contact:'
                : 'There are no matching candidates',
              items: fecfileSelectItems,
            },
          ]
        : []),
      {
        label: fecApiSelectItems.length
          ? 'Create a new contact from list of registered candidates:'
          : 'There are no matching registered candidates',
        items: fecApiSelectItems,
      },
    ];
  }
}

export class FecApiCommitteeLookupData extends FecApiLookupData {
  id: string | undefined;
  is_active: boolean | undefined;
  name: string | undefined;

  constructor(data: FecApiCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<FecApiCommitteeLookupData> {
    return {
      label: `${this.name} (${this.id})`,
      value: this,
    };
  }
}

export class FecfileCommitteeLookupData extends Contact {
  constructor(data: FecfileCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<Contact> {
    return {
      label: `${this.name} (${this.committee_id})`,
      value: this,
    };
  }
}

export class CommitteeLookupResponse {
  fec_api_committees?: FecApiCommitteeLookupData[];
  fecfile_committees?: FecfileCommitteeLookupData[];

  // prettier-ignore
  static fromJSON(json: any): CommitteeLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeLookupResponse, json);
  }

  toSelectItemGroups(includeFecfileResults: boolean): SelectItemGroup[] {
    const fecApiSelectItems =
      this.fec_api_committees?.map((data) => new FecApiCommitteeLookupData(data).toSelectItem()) || [];
    const fecfileSelectItems =
      this.fecfile_committees?.map((data) => new FecfileCommitteeLookupData(data).toSelectItem()) || [];
    return [
      ...(includeFecfileResults
        ? [
            {
              label: fecfileSelectItems.length
                ? 'Select an existing committee contact:'
                : 'There are no matching committees',
              items: fecfileSelectItems,
            },
          ]
        : []),
      {
        label: fecApiSelectItems.length
          ? 'Create a new contact from list of registered committees:'
          : 'There are no matching registered committees',
        items: fecApiSelectItems,
      },
    ];
  }
}

export class FecfileIndividualLookupData extends Contact {
  constructor(data: FecfileIndividualLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<Contact> {
    return {
      label: `${this.last_name}, ${this.first_name}`,
      value: this,
    };
  }
}

export class IndividualLookupResponse {
  fecfile_individuals?: FecfileIndividualLookupData[];

  // prettier-ignore
  static fromJSON(json: any): IndividualLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(IndividualLookupResponse, json);
  }

  toSelectItemGroups(): SelectItemGroup[] {
    const fecfileSelectItems =
      this.fecfile_individuals?.map((data) => new FecfileIndividualLookupData(data).toSelectItem()) || [];
    return [
      {
        label: fecfileSelectItems.length
          ? 'Select an existing individual contact:'
          : 'There are no matching individuals',
        items: fecfileSelectItems,
      },
    ];
  }
}

export class FecfileOrganizationLookupData extends Contact {
  constructor(data: FecfileOrganizationLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<Contact> {
    return {
      label: `${this.name}`,
      value: this,
    };
  }
}

export class OrganizationLookupResponse {
  fecfile_organizations?: FecfileOrganizationLookupData[];

  // prettier-ignore
  static fromJSON(json: any): OrganizationLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(OrganizationLookupResponse, json);
  }

  toSelectItemGroups(): SelectItemGroup[] {
    const fecfileSelectItems =
      this.fecfile_organizations?.map((data) => new FecfileOrganizationLookupData(data).toSelectItem()) || [];
    return [
      {
        label: fecfileSelectItems.length
          ? 'Select an existing organization contact:'
          : 'There are no matching organizations',
        items: fecfileSelectItems,
      },
    ];
  }
}
