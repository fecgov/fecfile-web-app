/* eslint-disable @typescript-eslint/no-explicit-any */
import { Contact } from '../../../../src/app/shared/models';

export interface LoanInfo {
  loan_amount: number;
  loan_incurred_date: string;
  loan_due_date: string;
  loan_interest_rate: string;
  secured: boolean;
  loan_restructured: boolean;
}

export interface Authorizor {
  last_name: string;
  first_name: string;
  middle_name: string | null;
  prefix: string | null;
  suffix: string | null;
  date_signed: string;
  title?: string;
}

function getAuthorizationFields(prefix: string, authorizor: Authorizor) {
  const auth = {
    [`${prefix}_first_name`]: authorizor.first_name,
    [`${prefix}_last_name`]: authorizor.last_name,
    [`${prefix}_middle_name`]: authorizor.middle_name,
    [`${prefix}_prefix`]: authorizor.prefix,
    [`${prefix}_suffix`]: authorizor.suffix,
    [`${prefix}_date_signed`]: authorizor.date_signed,
  };
  if (authorizor.title) auth[`${prefix}_title`] = authorizor.title;
  return auth;
}

export function getContactFields(prefix: string, contact: Contact, contact_number = 1) {
  return {
    [`${prefix}_first_name`]: contact.first_name,
    [`${prefix}_last_name`]: contact.last_name,
    [`${prefix}_middle_name`]: contact.middle_name,
    [`${prefix}_prefix`]: contact.prefix,
    [`${prefix}_suffix`]: contact.suffix,
    [`${prefix}_street_1`]: contact.street_1,
    [`${prefix}_street_2`]: contact.street_2,
    [`${prefix}_city`]: contact.city,
    [`${prefix}_state`]: contact.state,
    [`${prefix}_zip`]: contact.zip,
    [`${prefix}_employer`]: contact.employer,
    [`${prefix}_occupation`]: contact.occupation,
    [`contact_${contact_number}`]: {
      first_name: contact.first_name,
      last_name: contact.last_name,
      middle_name: contact.middle_name,
      prefix: contact.prefix,
      suffix: contact.suffix,
      street_1: contact.street_1,
      street_2: contact.street_2,
      city: contact.city,
      state: contact.state,
      zip: contact.zip,
      employer: contact.employer,
      occupation: contact.occupation,
    },
    [`contact_${contact_number}_id`]: contact.id,
  };
}

export function buildScheduleA(
  type: string,
  amount: number,
  date: string,
  contact: Contact,
  report_id?: string,
  extra_data?: any,
) {
  return {
    schedule_id: 'A',
    form_type: 'SA11AI',
    entity_type: contact.type,
    aggregation_group: 'GENERAL',

    transaction_type_identifier: type,
    schema_name: type,

    memo_code: null,
    contribution_amount: amount,
    contribution_date: date,
    contribution_purpose_descrip: null,

    children: [],
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('contributor', contact),
    ...extra_data,
  };
}

export function buildLoanAgreement(
  loanInfo: LoanInfo,
  contact: Contact,
  authorizors: [Authorizor, Authorizor],
  report_id: string,
  extra_data?: any,
) {
  return {
    contact_1: contact,
    use_parent_contact: true,
    schedule_id: 'C1',
    form_type: 'SC1/10',
    entity_type: 'ORG',
    transaction_type_identifier: 'C1_LOAN_AGREEMENT',
    schema_name: 'C1_LOAN_AGREEMENT',
    memo_code: null,
    purpose_description: null,
    text4000: null,
    ...loanInfo,
    children: [],
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('lender', contact),
    ...getAuthorizationFields('treasurer', authorizors[0]),
    ...getAuthorizationFields('authorized', authorizors[1]),
    ...extra_data,
  };
}

export function buildDebtOwedByCommittee(
  contact: Contact,
  report_id: string,
  purpose_of_debt_or_obligation: string,
  amount: number,
  extra_data?: any,
) {
  return {
    children: [],
    form_type: 'SD10',
    transaction_type_identifier: 'DEBT_OWED_BY_COMMITTEE',
    schema_name: 'DEBTS',
    fields_to_validate: [
      'report_type',
      'form_type',
      'transaction_type_identifier',
      'entity_type',
      'creditor_last_name',
      'creditor_first_name',
      'creditor_middle_name',
      'creditor_prefix',
      'creditor_suffix',
      'creditor_street_1',
      'creditor_street_2',
      'creditor_city',
      'creditor_state',
      'creditor_zip',
      'purpose_of_debt_or_obligation',
      'beginning_balance',
      'incurred_amount',
    ],
    report_ids: [report_id],
    entity_type: 'COM',
    purpose_of_debt_or_obligation,
    beginning_balance: 0,
    incurred_amount: amount,
    payment_amount: 0,
    balance_at_close: amount,
    schedule_id: 'D',
    ...getContactFields('creditor', contact),
    ...extra_data,
  };
}

export function buildLoanFromBank(
  loanInfo: LoanInfo,
  contact: Contact,
  report_id: string,
  children: [any, any],
  extra_data?: any,
) {
  return {
    schedule_id: 'C',
    form_type: 'SC/10',
    entity_type: 'ORG',
    transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK',
    schema_name: 'LOANS',
    memo_code: null,
    purpose_description: null,
    text4000: null,
    receipt_line_number: '13',
    ...loanInfo,
    children,
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('lender', contact),
    ...extra_data,
  };
}

export function buildLoanReceipt(
  contribution_amount: number,
  contribution_date: string,
  contact: Contact,
  report_id: string,
  extra_data?: any,
) {
  return {
    schedule_id: 'A',
    form_type: 'SA13',
    entity_type: contact.type,
    aggregation_group: 'GENERAL',
    transaction_type_identifier: 'LOAN_RECEIVED_FROM_BANK_RECEIPT',
    schema_name: 'LOANS_RECEIVED',
    contribution_amount,
    contribution_date,
    contribution_purpose_descrip: null,
    children: [],
    contact_1: contact,
    use_parent_contact: true,
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    contact_1_id: contact.id,
    ...extra_data,
  };
}

export function buildContributionToCandidate(
  expenditure_amount: number,
  expenditure_date: string,
  contacts: [Contact, Contact],
  report_id: string,
  extra_data?: any,
) {
  return {
    schedule_id: 'B',
    form_type: 'SB23',
    entity_type: 'COM',
    transaction_type_identifier: 'CONTRIBUTION_TO_CANDIDATE',
    schema_name: 'CANDIDATE_CONTRIBUTIONS',
    category_code: null,
    memo_code: null,
    purpose_description: null,
    text4000: null,
    expenditure_amount,
    expenditure_date,
    expenditure_purpose_descrip: null,
    children: [],
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('payee', contacts[0]),
    ...getContactFields('beneficiary_committee', contacts[1], 2),
    ...extra_data,
  };
}

export function buildIndependentExpenditure(
  expenditure_amount: number,
  dates: [string, string],
  contacts: [Contact, Contact],
  memo_code: boolean,
  report_id: string,
  extra_data?: any,
) {
  return {
    schedule_id: 'E',
    form_type: 'SE',
    entity_type: contacts[0].type,
    aggregation_group: 'INDEPENDENT_EXPENDITURE',
    transaction_type_identifier: 'INDEPENDENT_EXPENDITURE',
    schema_name: 'INDEPENDENT_EXPENDITURES',
    memo_code,
    expenditure_amount,
    dissemination_date: dates[0],
    disbursement_date: dates[1],
    contribution_purpose_descrip: null,
    children: [],
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('payee', contacts[0]),
    ...getContactFields('so_candidate', contacts[1], 2),
    ...extra_data,
  };
}

export function buildScheduleF(
  amount: number,
  date: string,
  contact_1: any,
  contact_2: any,
  contact_3: any,
  report_id: string,
  extra_data?: any,
) {
  return {
    schedule_id: 'F',
    form_type: 'SF',
    entity_type: contact_1.type,
    aggregation_group: 'COORDINATED_PARTY_EXPENDITURES',

    transaction_type_identifier: 'COORDINATED_PARTY_EXPENDITURE',
    schema_name: 'COORDINATED_PARTY_EXPENDITURES',

    expenditure_amount: amount,
    expenditure_date: date,
    general_election_year: '2024',
    expenditure_purpose_descrip: 'Test Data',

    children: [],
    report_ids: [report_id],
    fields_to_validate: ['schedule_id'],
    ...getContactFields('payee', contact_1),
    ...getContactFields('payee_candidate', contact_2, 2),
    ...getContactFields('payee_committee', contact_3, 3),
    ...extra_data,
  };
}

const f = {
  payee_organization_name: 'Testerson',
  payee_last_name: null,
  payee_first_name: null,
  payee_middle_name: null,
  payee_prefix: null,
  payee_suffix: null,
  payee_street_1: '1234 Test Ln',
  payee_street_2: null,
  payee_city: 'Testville',
  payee_state: 'AL',
  payee_zip: '12345',
  payee_candidate_id_number: 'S4NH00104',
  payee_candidate_last_name: 'TESTERMAN',
  payee_candidate_first_name: 'KAREN',
  payee_candidate_middle_name: null,
  payee_candidate_prefix: null,
  payee_candidate_suffix: null,
  payee_candidate_office: 'S',
  payee_candidate_district: null,
  payee_candidate_state: 'NH',
  payee_committee_id_number: 'C00412304',
  payee_committee_name: 'MONTANANS FOR TESTER',
  memo_text_description: null,
  designating_committee_id_number: null,
  designating_committee_name: null,
  subordinate_committee_id_number: null,
  subordinate_committee_name: null,
  subordinate_street_1: null,
  subordinate_street_2: null,
  subordinate_city: null,
  subordinate_state: null,
  subordinate_zip: null,
};
