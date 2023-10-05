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
export const COMMITTEE_ORGANIZATION_INDIVIDUAL = [
  ContactTypes.COMMITTEE,
  ContactTypes.ORGANIZATION,
  ContactTypes.INDIVIDUAL,
];

export function getContactTypeOptions(contactTypes: ContactTypes[]) {
  return LabelUtils.getPrimeOptions(ContactTypeLabels, contactTypes);
}

/**
 * FORM CONTROL PRESETS
 */

export const ADDRESS_FIELDS: string[] = ['street_1', 'street_2', 'city', 'state', 'zip'];

export const COMMON_FIELDS: string[] = ['date', 'amount', 'purpose_description', 'memo_code', 'text4000'];

export const AGGREGATE: string[] = ['aggregate'];

export const INDIVIDUAL_FIELDS: string[] = ['last_name', 'first_name', 'middle_name', 'prefix', 'suffix'];

export const ORG_FIELDS: string[] = ['organization_name'];

export const COM_FIELDS: string[] = ['organization_name', 'committee_fec_id', 'committee_name'];
export const COM_FIELDS_SHORT: string[] = ['committee_fec_id', 'committee_name'];

export const EMPLOYEE_INFO_FIELDS: string[] = ['employer', 'occupation'];

export const CANDIDATE_FIELDS: string[] = [
  'candidate_fec_id',
  'candidate_last_name',
  'candidate_first_name',
  'candidate_middle_name',
  'candidate_prefix',
  'candidate_suffix',
];
export const CANDIDATE_OFFICE_FIELDS: string[] = ['candidate_office', 'candidate_state', 'candidate_district'];

export const ELECTION_FIELDS: string[] = ['election_code', 'election_other_description'];

export const CATEGORY_CODE: string[] = ['category_code'];

export const LOAN_FINANCE_FIELDS: string[] = ['payment_to_date', 'balance'];
export const LOAN_TERMS_FIELDS: string[] = [
  'due_date',
  'due_date_setting',
  'interest_rate',
  'interest_rate_setting',
  'secured',
];

export const SECONDARY_ADDRESS_FIELDS: string[] = [
  'secondary_street_1',
  'secondary_street_2',
  'secondary_city',
  'secondary_state',
  'secondary_zip',
];
export const SIGNATORY_1_FIELDS: string[] = [
  'signatory_1_last_name',
  'signatory_1_first_name',
  'signatory_1_middle_name',
  'signatory_1_prefix',
  'signatory_1_suffix',
  'signatory_1_date',
];
export const SIGNATORY_2_FIELDS: string[] = [
  'signatory_2_last_name',
  'signatory_2_first_name',
  'signatory_2_middle_name',
  'signatory_2_prefix',
  'signatory_2_suffix',
  'signatory_2_title',
  'signatory_2_date',
];

export function hasFields(formFields: string[], fieldsToHave: string[]): boolean {
  return fieldsToHave.reduce((result, election_field) => result && formFields.includes(election_field), true);
}

export const INDIVIDUAL_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
];
export const INDIVIDUAL_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
];
export const INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_WITH_EMPLOYEE_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
];
export const ORGANIZATION_FORM_FIELDS = [...COMMON_FIELDS, ...ADDRESS_FIELDS, ...AGGREGATE, ...ORG_FIELDS];
export const ORGANIZATION_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
];
export const COMMITTEE_FORM_FIELDS = [...COMMON_FIELDS, ...ADDRESS_FIELDS, ...AGGREGATE, ...COM_FIELDS];
export const COMMITTEE_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_COMMITTEE_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...COM_FIELDS,
];
export const COMMITTEE_WITH_CANDIDATE_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
  ...ELECTION_FIELDS,
];
export const COMMITTEE_WITH_CANDIDATE_AND_ELECTION_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_OR_ORGANIZATION_WITH_COMMITTEE_AND_CANDIDATE_AND_ELECTION_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...ORG_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...COM_FIELDS_SHORT,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_OR_ORGANIZATION_WITH_COMMITTEE_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...ORG_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...COM_FIELDS_SHORT,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_WITH_EMPLOYEE_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_CANDIDATE_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CANDIDATE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const COMMITTEE_NO_AGGREGATE_FORM_FIELDS = [...COMMON_FIELDS, ...ADDRESS_FIELDS, ...COM_FIELDS];
export const ORGANIZATION_NO_AGGREGATE_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
export const INDIVIDUAL_ORGANIZATION_ELECTION_B_FORM_FIELDS = [
  ...COMMON_FIELDS,
  ...ADDRESS_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
];
