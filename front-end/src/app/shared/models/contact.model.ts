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
  id: number | undefined;
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

  // prettier-ignore
  static fromJSON(json: any): Contact { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(Contact, json);
  }
}

export class FecCommitteeLookupData {
  id: string | undefined;
  name: string | undefined;
  // prettier-ignore
  static fromJSON(json: any): FecCommitteeLookupData { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(FecCommitteeLookupData, json);
  }
  static toSelectItem(data: FecCommitteeLookupData): SelectItem<string> {
    return (
      data && {
        label: `${data.name} (${data.id})`,
        value: `${data.id}`,
      }
    );
  }
}

export class CommitteeLookupResponse {
  fec_api_committees: FecCommitteeLookupData[] | undefined;
  fecfile_committees: FecCommitteeLookupData[] | undefined;
  // prettier-ignore
  static fromJSON(json: any): CommitteeLookupResponse { // eslint-disable-line @typescript-eslint/no-explicit-any
    return plainToClass(CommitteeLookupResponse, json);
  }
  toSelectItemGroups(): SelectItemGroup[] {
    const fecApiSelectItems = this.fec_api_committees?.map((data) => FecCommitteeLookupData.toSelectItem(data)) || [];
    const fecfileSelectItems = this.fecfile_committees?.map((data) => FecCommitteeLookupData.toSelectItem(data)) || [];
    return [
      {
        label: 'Select an existing committee contact:',
        items: fecfileSelectItems,
      },
      {
        label: 'Create a new contact from list of registered committee:',
        items: fecApiSelectItems,
      },
    ];
  }
}
