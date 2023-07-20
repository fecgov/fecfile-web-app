import { ContactTypeLabels, ContactTypes } from '../models/contact.model';
import { LabelUtils } from './label.utils';

/**
 * CONTACT TYPE OPTIONS
 */
export const INDIVIDUAL = [ContactTypes.INDIVIDUAL];
export const ORGANIZATION = [ContactTypes.ORGANIZATION];
export const COMMITTEE = [ContactTypes.COMMITTEE];
export const COMMITTEE_INDIVIDUAL = [ContactTypes.COMMITTEE, ContactTypes.INDIVIDUAL];
export const ORGANIZATION_INDIVIDUAL = [ContactTypes.ORGANIZATION, ContactTypes.INDIVIDUAL];
export const INDIVIDUAL_ORGANIZATION = [ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION];
export const INDIVIDUAL_ORGANIZATION_COMMITTEE = [
  ContactTypes.INDIVIDUAL,
  ContactTypes.ORGANIZATION,
  ContactTypes.COMMITTEE,
];
export const ORGANIZATION_INDIVIDUAL_COMMITTEE = [
  ContactTypes.ORGANIZATION,
  ContactTypes.INDIVIDUAL,
  ContactTypes.COMMITTEE,
];

export function getContactTypeOptions(contactTypes: ContactTypes[]) {
  return LabelUtils.getPrimeOptions(ContactTypeLabels, contactTypes);
}

/**
 * FORM CONTROL PRESETS
 */

export const CORE_FIELDS: string[] = [
  'street_1',
  'street_2',
  'city',
  'state',
  'zip',
  'date',
  'amount',
  'purpose_description',
  'memo_code',
  'text4000',
];

export const AGGREGATE: string[] = ['aggregate'];

export const INDIVIDUAL_FIELDS: string[] = ['last_name', 'first_name', 'middle_name', 'prefix', 'suffix'];

export const ORG_FIELDS: string[] = ['organization_name'];

export const COM_FIELDS: string[] = ['organization_name', 'committee_fec_id', 'committee_name'];

export const EMPLOYEE_INFO_FIELDS: string[] = ['employer', 'occupation'];

export const CANDIDATE_FIELDS: string[] = [
  'candidate_fec_id',
  'candidate_last_name',
  'candidate_first_name',
  'candidate_middle_name',
  'candidate_prefix',
  'candidate_suffix',
  'candidate_office',
  'candidate_state',
  'candidate_district',
];
export const CANDIDATE_OFFICE_FIELDS: string[] = ['candidate_office', 'candidate_state', 'candidate_district'];

export const ELECTION_FIELDS: string[] = ['election_code', 'election_other_description'];

export const CATEGORY_CODE: string[] = ['category_code'];

export const LOAN_FINANCE_FIELDS: string[] = ['loan_payment_to_date', 'balance'];
export const LOAN_TERMS_FIELDS: string[] = ['loan_due_date', 'loan_interest_rate', 'secured'];

export function hasFields(formFields: string[], fieldsToHave: string[]): boolean {
  return fieldsToHave.reduce((result, election_field) => result && formFields.includes(election_field), true);
}

export const INDIVIDUAL_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...INDIVIDUAL_FIELDS, ...EMPLOYEE_INFO_FIELDS];
export const INDIVIDUAL_B_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...INDIVIDUAL_FIELDS, ...CATEGORY_CODE];
export const INDIVIDUAL_ORGANIZATION_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS];
export const INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_WITH_EMPLOYEE_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
];
export const ORGANIZATION_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...ORG_FIELDS];
export const ORGANIZATION_B_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...ORG_FIELDS, ...CATEGORY_CODE];
export const COMMITTEE_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...COM_FIELDS];
export const COMMITTEE_B_FORM_FIELDS = [...CORE_FIELDS, ...AGGREGATE, ...COM_FIELDS, ...CATEGORY_CODE];
export const INDIVIDUAL_COMMITTEE_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...COM_FIELDS,
];
export const COMMITTEE_WITH_CANDIDATE_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
];
export const COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_WITH_EMPLOYEE_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CANDIDATE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const COMMITTEE_NO_AGGREGATE_FORM_FIELDS = [...CORE_FIELDS, ...COM_FIELDS];
export const ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS = [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
