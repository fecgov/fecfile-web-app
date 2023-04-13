import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchBTransactionType extends TransactionType {
  scheduleId = 'B';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    last_name: 'payee_last_name',
    first_name: 'payee_first_name',
    middle_name: 'payee_middle_name',
    prefix: 'payee_prefix',
    suffix: 'payee_suffix',
    street_1: 'payee_street_1',
    street_2: 'payee_street_2',
    city: 'payee_city',
    state: 'payee_state',
    zip: 'payee_zip',
    employer: '',
    occupation: '',
    organization_name: 'payee_organization_name',
    committee_fec_id: 'beneficiary_committee_fec_id',
    date: 'expenditure_date',
    dateLabel: 'DATE',
    memo_code: 'memo_code',
    amount: 'expenditure_amount',
    aggregate: 'aggregate_amount',
    purpose_description: 'expenditure_purpose_descrip',
    purposeDescripLabel: 'PURPOSE OF DISBURSEMENT',
    memo_text_input: 'memo_text_input',
    category_code: 'category_code',
    election_code: 'election_code',
    election_other_description: 'election_other_description',
  };
}
