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
}

export class FecApiLookupData {

}
export class FecApiCommitteeLookupData extends FecApiLookupData {
  id: string | null = null;
  is_active: boolean | null = null;
  name: string | null = null;

  constructor(data: FecApiCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<FecApiCommitteeLookupData> {
    return (
      {
        label: `${this.name} (${this.id})`,
        value: this,
      }
    );
  }
}

export class FecfileCommitteeLookupData extends Contact {
  constructor(data: FecfileCommitteeLookupData) {
    super();
    Object.assign(this, data);
  }

  toSelectItem(): SelectItem<Contact> {
    return (
      {
        label: `${this.name} (${this.committee_id})`,
        value: this,
      }
    );
  }
}

export class CommitteeLookupResponse {
  fec_api_committees?: FecApiCommitteeLookupData[];
  fecfile_committees?: FecfileCommitteeLookupData[];

  // prettier-ignore
  static fromJSON(json: any): CommitteeLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeLookupResponse, json);
  }

  toSelectItemGroups(): SelectItemGroup[] {
    const fecApiSelectItems = this.fec_api_committees?.map((data) =>
      new FecApiCommitteeLookupData(data).toSelectItem()) || [];
    const fecfileSelectItems = this.fecfile_committees?.map((data) =>
      new FecfileCommitteeLookupData(data).toSelectItem()) || [];
    return [
      {
        label: (fecfileSelectItems && fecfileSelectItems.length > 0) ?
          'Select an existing committee contact:' :
          'There are no matching committees',
        items: fecfileSelectItems,
      },
      {
        label: (fecApiSelectItems && fecApiSelectItems.length > 0) ?
          'Create a new contact from list of registered committees:' :
          'There are no matching registered committees',
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
    return (
      {
        label: `${this.last_name}, ${this.first_name}`,
        value: this,
      }
    );
  }
}

export class IndividualLookupResponse {
  fecfile_individuals?: FecfileIndividualLookupData[];

  // prettier-ignore
  static fromJSON(json: any): IndividualLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(IndividualLookupResponse, json);
  }

  toSelectItemGroups(): SelectItemGroup[] {
    const fecfileSelectItems = this.fecfile_individuals?.map((data) =>
      new FecfileIndividualLookupData(data).toSelectItem()) || [];
    return [
      {
        label: (fecfileSelectItems && fecfileSelectItems.length > 0) ?
          'Select an existing individual contact:' :
          'There are no matching individuals',
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
    return (
      {
        label: `${this.name}`,
        value: this,
      }
    );
  }
}

export class OrganizationLookupResponse {
  fecfile_organizations?: FecfileOrganizationLookupData[];

  // prettier-ignore
  static fromJSON(json: any): OrganizationLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(OrganizationLookupResponse, json);
  }

  toSelectItemGroups(): SelectItemGroup[] {
    const fecfileSelectItems = this.fecfile_organizations?.map((data) =>
      new FecfileOrganizationLookupData(data).toSelectItem()) || [];
    return [
      {
        label: (fecfileSelectItems && fecfileSelectItems.length > 0) ?
          'Select an existing organization contact:' :
          'There are no matching organizations',
        items: fecfileSelectItems,
      },
    ];
  }

}
