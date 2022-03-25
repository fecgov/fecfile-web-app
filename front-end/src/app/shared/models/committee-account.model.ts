import { plainToClass } from 'class-transformer';
import { BaseModel } from './base.model';
import { LabelList } from '../utils/label.utils';

export enum CommitteeTypes {
  COMMUNICATION_COST = 'C',
  DELEGATE = 'D',
  ELECTIONEERING_COMMUNICATIONS = 'E',
  HOUSE = 'H',
  INDEPENDENT_EXPENDITURE = 'I',
  NON_PARTY_NON_QUALIFIED = 'N',
  INDEPENDENT_EXPENDITURE_ONLY_CMTE = 'O',
  NON_PARTY_QUALIFIED = 'Q',
  PRESIDENTIAL = 'P',
  SENATE = 'S',
  SINGLE_CANDIDATE_INDEPENDENT_EXPENDITURE_CMTE = 'U',
  NON_QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT = 'V',
  QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT = 'W',
  PARTY_NON_QUALIFIED = 'X',
  PARTY_QUALIFIED = 'Y',
  PARTY_NON_FEDERAL_ACCOUNTS = 'Z',
}

export type CommitteeType =
  | CommitteeTypes.COMMUNICATION_COST
  | CommitteeTypes.DELEGATE
  | CommitteeTypes.ELECTIONEERING_COMMUNICATIONS
  | CommitteeTypes.HOUSE
  | CommitteeTypes.INDEPENDENT_EXPENDITURE
  | CommitteeTypes.NON_PARTY_NON_QUALIFIED
  | CommitteeTypes.INDEPENDENT_EXPENDITURE_ONLY_CMTE
  | CommitteeTypes.NON_PARTY_QUALIFIED
  | CommitteeTypes.PRESIDENTIAL
  | CommitteeTypes.SENATE
  | CommitteeTypes.SINGLE_CANDIDATE_INDEPENDENT_EXPENDITURE_CMTE
  | CommitteeTypes.NON_QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT
  | CommitteeTypes.QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT
  | CommitteeTypes.PARTY_NON_QUALIFIED
  | CommitteeTypes.PARTY_QUALIFIED
  | CommitteeTypes.PARTY_NON_FEDERAL_ACCOUNTS;

export const CommitteeTypeLabels: LabelList = [
  [CommitteeTypes.COMMUNICATION_COST, 'Communication Cost - Form 7'],
  [CommitteeTypes.DELEGATE, 'Delegate'],
  [CommitteeTypes.ELECTIONEERING_COMMUNICATIONS, 'Electioneering Communicatins - Form 9'],
  [CommitteeTypes.HOUSE, 'House'],
  [CommitteeTypes.INDEPENDENT_EXPENDITURE, 'Independent Expenditure (Person or Group, Not A Committee) - Form 5'],
  [CommitteeTypes.NON_PARTY_NON_QUALIFIED, 'Non-Party Non-Qualified'],
  [
    CommitteeTypes.INDEPENDENT_EXPENDITURE_ONLY_CMTE,
    'Independent Expenditure Only Cmte - Form 1 with SpeechNow cover letter (Super PACS)',
  ],
  [CommitteeTypes.NON_PARTY_QUALIFIED, 'Non-Party Qualified'],
  [CommitteeTypes.PRESIDENTIAL, 'Presidential'],
  [CommitteeTypes.SENATE, 'Senate'],
  [
    CommitteeTypes.SINGLE_CANDIDATE_INDEPENDENT_EXPENDITURE_CMTE,
    'Single Candidate Independent Expenditure Cmte - Form 1 line 5(c)',
  ],
  [
    CommitteeTypes.NON_QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT,
    'Non-Qualified Non-Party with Separate Contribution Account with Carey cover letter',
  ],
  [
    CommitteeTypes.QUALIFIED_NON_PARTY_WITH_SEP_ACCOUNT,
    'Qualified Non-Party with Separate Contribution Account with Carey cover letter',
  ],
  [CommitteeTypes.PARTY_NON_QUALIFIED, 'Party Non-Qualified'],
  [CommitteeTypes.PARTY_QUALIFIED, 'Party Qualified'],
  [CommitteeTypes.PARTY_NON_FEDERAL_ACCOUNTS, 'Party Non-Federal Accounts - Schedules L & I'],
];

export enum CommitteeDesignations {
  PRINCIPLE_CAMPAIGN_COMMITTEE = 'P',
  AUTHORIZED_COMMITTEE = 'A',
  JOINT_FUNDRAISER_COMMITTEE = 'J',
  UNAUTHORIZED_COMMITTEE = 'U',
  LOBBYIST_REGISTRANT_PAC = 'B',
  LEADERSHIP_PAC = 'D',
}

export type CommitteeDesignation =
  | CommitteeDesignations.PRINCIPLE_CAMPAIGN_COMMITTEE
  | CommitteeDesignations.AUTHORIZED_COMMITTEE
  | CommitteeDesignations.JOINT_FUNDRAISER_COMMITTEE
  | CommitteeDesignations.UNAUTHORIZED_COMMITTEE
  | CommitteeDesignations.LOBBYIST_REGISTRANT_PAC
  | CommitteeDesignations.LEADERSHIP_PAC;

export const CommitteeDesignationLabels: LabelList = [
  [CommitteeDesignations.PRINCIPLE_CAMPAIGN_COMMITTEE, 'Principal Campaign Committee (PCC) - Form 1 line 5(a)'],
  [CommitteeDesignations.AUTHORIZED_COMMITTEE, 'Authorized Committee - Form 1 line 5(b)'],
  [CommitteeDesignations.JOINT_FUNDRAISER_COMMITTEE, 'Joint Fundraiser Committee - Form 1 line 5(g) or 5(h)'],
  [CommitteeDesignations.UNAUTHORIZED_COMMITTEE, 'Unauthorized Committee'],
  [
    CommitteeDesignations.LOBBYIST_REGISTRANT_PAC,
    'Lobbyist/Registrant PAC - Form 1 line 5(e) last box or 5(f) 2nd box',
  ],
  [CommitteeDesignations.LEADERSHIP_PAC, 'Leadership PAC - Form 1 line 5(f) 3rd box'],
];

export class CommitteeAccount extends BaseModel {
  city: string | null = null;
  cmte_dsgn: string | null = null;
  cmte_filed_type: string | null = null;
  cmte_filing_freq: string | null = null;
  cmte_type: CommitteeType | null = null;
  cmte_type_category: string | null = null;
  committeeid: string = '';
  committeename: string = '';
  created_at: string | null = null;
  email_on_file: string | null = null;
  email_on_file_1: string | null = null;
  fax: string | null = null;
  levin_accounts: string | null = null;
  phone_number: string | null = null;
  state: string | null = null;
  street1: string | null = null;
  street2: string | null = null;
  treasureremail: string | null = null;
  treasurerfirstname: string | null = null;
  treasurerlastname: string | null = null;
  treasurermiddlename: string | null = null;
  treasurerphone: string | null = null;
  treasurerprefix: string | null = null;
  treasurersuffix: string | null = null;
  website: string | null = null;
  zipcode: string | null = null;

  static fromJSON(json: any): CommitteeAccount {
    return plainToClass(CommitteeAccount, json);
  }
}
