import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchC2TransactionType extends TransactionType {
  scheduleId = 'C1';
  apiEndpoint = '/transactions/schedule-c2';
  override amountInputHeader = 'Loan Information';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
    last_name: 'guarantor_last_name',
    first_name: 'guarantor_first_name',
    middle_name: 'guarantor_middle_name',
    prefix: 'guarantor_prefix',
    suffix: 'guarantor_suffix',
    street_1: 'guarantor_street_1',
    street_2: 'guarantor_street_2',
    city: 'guarantor_city',
    state: 'guarantor_state',
    zip: 'guarantor_zip',
    employer: 'guarantor_employer',
    occupation: 'guarantor_occupation',
    organization_name: '',
    committee_fec_id: '',
    committee_name: '',
    candidate_fec_id: '',
    candidate_last_name: '',
    candidate_first_name: '',
    candidate_middle_name: '',
    candidate_prefix: '',
    candidate_suffix: '',
    candidate_office: '',
    candidate_state: '',
    candidate_district: '',
    payment_to_date: '',
    interest_rate: '',
    due_date: '',
    secured: '',
    date: '',
    memo_code: '',
    amount: 'guaranteed_amount',
    balance: '',
    aggregate: '',
    purpose_description: '',
    text4000: 'text4000',
    category_code: '',
    election_code: '',
    election_other_description: '',
  };
}
