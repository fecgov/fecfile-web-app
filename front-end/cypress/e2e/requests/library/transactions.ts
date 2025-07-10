/* eslint-disable @typescript-eslint/no-explicit-any */
export function getContactFields(prefix: string, contact: any, contact_number = 1) {
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
  contact: any,
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

export function buildContributionToCandidate(
  expenditure_amount: number,
  expenditure_date: string,
  contacts: any[2],
  report_id?: string,
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
  contacts: any[2],
  memo_code: boolean,
  report_id?: string,
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
  report_id?: string,
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
