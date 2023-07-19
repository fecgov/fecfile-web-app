import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchC1TransactionType extends TransactionType {
  scheduleId = 'C1';
  apiEndpoint = '/transactions/schedule-c1';

  // Labels
  override amountInputHeader = 'Loan Information';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
    last_name: '',
    first_name: '',
    middle_name: '',
    prefix: '',
    suffix: '',
    street_1: 'lender_street_1',
    street_2: 'lender_street_2',
    city: 'lender_city',
    state: 'lender_state',
    zip: 'lender_zip',
    employer: '',
    occupation: '',
    organization_name: 'lender_organization_name',
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
    date: 'loan_incurred_date',
    memo_code: '',
    amount: 'loan_amount',
    balance: 'total_balance',
    payment_to_date: '',
    interest_rate: '',
    due_date: '',
    secured: '',
    aggregate: '',
    purpose_description: '',
    text4000: 'text4000',
    category_code: '',
    election_code: '',
    election_other_description: '',
  };
}
