import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchDTransactionType extends TransactionType {
  scheduleId = 'D';
  apiEndpoint = '/transactions/schedule-d';

  // Labels
  override debtInputHeader = 'Debt or obligation information';
  override purposeDescripLabel = 'PURPOSE OF DEBT OR OBLIGATION';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
    last_name: 'creditor_last_name',
    first_name: 'creditor_first_name',
    middle_name: 'creditor_middle_name',
    prefix: 'creditor_prefix',
    suffix: 'creditor_suffix',
    street_1: 'creditor_street_1',
    street_2: 'creditor_street_2',
    city: 'creditor_city',
    state: 'creditor_state',
    zip: 'creditor_zip',
    employer: '',
    occupation: '',
    organization_name: 'creditor_organization_name',
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
    date: '',
    memo_code: '',
    amount: 'incurred_amount',
    balance: 'beginning_balance',
    payment_to_date: '',
    interest_rate: '',
    due_date: '',
    interest_rate_setting: '',
    due_date_setting: '',
    secured: '',
    aggregate: '',
    purpose_description: 'purpose_of_debt_or_obligation',
    text4000: '',
    category_code: '',
    election_code: '',
    election_other_description: '',
    secondary_name: '',
    secondary_street_1: '',
    secondary_street_2: '',
    secondary_city: '',
    secondary_state: '',
    secondary_zip: '',
    signatory_1_last_name: '',
    signatory_1_first_name: '',
    signatory_1_middle_name: '',
    signatory_1_prefix: '',
    signatory_1_suffix: '',
    signatory_1_date: '',
    signatory_2_last_name: '',
    signatory_2_first_name: '',
    signatory_2_middle_name: '',
    signatory_2_prefix: '',
    signatory_2_suffix: '',
    signatory_2_title: '',
    signatory_2_date: '',
  };
}
