// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getContactFields(prefix: string, contact: any, contact_number = 1) {
  return {
    entity_type: contact.type,
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  contact: any,
  report_id?: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  extra_data?: any,
) {
  return {
    schedule_id: 'A',
    form_type: 'SA11AI',
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
