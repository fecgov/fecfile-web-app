import { plainToInstance } from 'class-transformer';
import { ContactTypes, FullNameContact } from './contact.model';

export const CandidateOfficeTypes = {
  HOUSE: 'H',
  PRESIDENTIAL: 'P',
  SENATE: 'S',
} as const;
export type CandidateOfficeTypes = (typeof CandidateOfficeTypes)[keyof typeof CandidateOfficeTypes];

export const CandidateOfficeTypeLabels = [
  [CandidateOfficeTypes.HOUSE, 'House'],
  [CandidateOfficeTypes.PRESIDENTIAL, 'Presidential'],
  [CandidateOfficeTypes.SENATE, 'Senate'],
];

export class Candidate extends FullNameContact {
  override type = ContactTypes.CANDIDATE;
  candidate_id: string | undefined;
  candidate_office: CandidateOfficeTypes | undefined;
  candidate_state: string | undefined;
  candidate_district: string | undefined;

  static fromJSON(json: unknown): Candidate {
    return plainToInstance(Candidate, json);
  }
}
