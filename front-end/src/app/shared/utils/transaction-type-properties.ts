import { ContactTypeLabels, ContactTypes } from '../models/contact.model';
import { TemplateMapKeyType, TransactionTemplateMapType } from '../models/transaction-type.model';
import { LabelUtils, PrimeOptions } from './label.utils';

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

function hasFields(formFields: string[], fieldsToHave: string[]): boolean {
  return fieldsToHave.reduce((result, election_field) => result && formFields.includes(election_field), true);
}

export class TransactionFormFieldsConfig {
  contactTypeOptions: ContactTypes[] = [];
  formControlNames: string[] = [];

  constructor(contactTypeOptions: ContactTypes[], formControlNames: string[]) {
    this.contactTypeOptions = contactTypeOptions;
    this.formControlNames = formControlNames;
  }

  getFormControlNames(templateMap: TransactionTemplateMapType): string[] {
    const templateFields = this.formControlNames
      .map((name: string) => templateMap[name as TemplateMapKeyType])
      .filter((field) => !!field);
    return ['entity_type', ...templateFields];
  }

  hasElectionInformation(): boolean {
    return hasFields(this.formControlNames, ELECTION_FIELDS);
  }
  hasCandidateInformation(): boolean {
    return hasFields(this.formControlNames, CANDIDATE_FIELDS);
  }
  hasCommitteeFecId(): boolean {
    return hasFields(this.formControlNames, ['committee_fec_id']);
  }
  hasEmployeeFields(): boolean {
    return hasFields(this.formControlNames, EMPLOYEE_INFO_FIELDS);
  }
  hasCandidateOffice(): boolean {
    return hasFields(this.formControlNames, CANDIDATE_OFFICE_FIELDS);
  }
  hasLoanFinanceFields(): boolean {
    return hasFields(this.formControlNames, LOAN_FINANCE_FIELDS);
  }
  hasLoanTermsFields(): boolean {
    return hasFields(this.formControlNames, LOAN_TERMS_FIELDS);
  }
}

export const GROUP_A: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
]);
export const GROUP_A_FOR_B: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_B_FOR_A: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...AGGREGATE, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS]
);
export const GROUP_B: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL_ORGANIZATION_COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_B_NO_COM: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL_ORGANIZATION, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_C: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL_ORGANIZATION_COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
]);
export const GROUP_C_FOR_B: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
  [...CORE_FIELDS, ...AGGREGATE, ...INDIVIDUAL_FIELDS, ...ORG_FIELDS, ...CATEGORY_CODE]
);
export const GROUP_D: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(ORGANIZATION, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...ORG_FIELDS,
]);
export const GROUP_D_FOR_B: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(ORGANIZATION, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...ORG_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_EFI: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
]);
export const GROUP_EFI_FOR_B: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_G: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE_INDIVIDUAL, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...COM_FIELDS,
]);
export const GROUP_H: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
]);
// export const GROUP_L: TransactionTypeFormProperties = new TransactionTypeFormProperties(ORGANIZATION_INDIVIDUAL, [
//   ...CORE_FIELDS,
//   ...INDIVIDUAL_FIELDS,
//   ...COM_FIELDS,
//   ...CANDIDATE_FIELDS,
//   ...ELECTION_FIELDS,
// ]);
export const GROUP_M: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE, [
  ...CORE_FIELDS,
  ...COM_FIELDS,
  ...CANDIDATE_FIELDS,
  ...CANDIDATE_OFFICE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_N: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL, [
  ...CORE_FIELDS,
  ...INDIVIDUAL_FIELDS,
  ...EMPLOYEE_INFO_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_O: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(ORGANIZATION_INDIVIDUAL_COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...CANDIDATE_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_P: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(COMMITTEE, [
  ...CORE_FIELDS,
  ...COM_FIELDS,
]);
export const GROUP_R: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(ORGANIZATION, [
  ...CORE_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
]);
export const GROUP_S: TransactionFormFieldsConfig = new TransactionFormFieldsConfig(INDIVIDUAL_ORGANIZATION_COMMITTEE, [
  ...CORE_FIELDS,
  ...AGGREGATE,
  ...INDIVIDUAL_FIELDS,
  ...ORG_FIELDS,
  ...ELECTION_FIELDS,
  ...CATEGORY_CODE,
]);
