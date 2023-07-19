import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchATransactionType extends TransactionType {
  scheduleId = 'A';
  apiEndpoint = '/transactions/schedule-a';

  //Labels
  override dateLabel = 'DATE RECEIVED';
  override amountInputHeader = 'Receipt Information';
  override purposeDescripLabel = 'PURPOSE OF RECEIPT';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
    last_name: 'contributor_last_name',
    first_name: 'contributor_first_name',
    middle_name: 'contributor_middle_name',
    prefix: 'contributor_prefix',
    suffix: 'contributor_suffix',
    street_1: 'contributor_street_1',
    street_2: 'contributor_street_2',
    city: 'contributor_city',
    state: 'contributor_state',
    zip: 'contributor_zip',
    employer: 'contributor_employer',
    occupation: 'contributor_occupation',
    organization_name: 'contributor_organization_name',
    committee_fec_id: 'donor_committee_fec_id',
    committee_name: 'donor_committee_name',
    candidate_fec_id: 'donor_candidate_fec_id',
    candidate_last_name: 'donor_candidate_last_name',
    candidate_first_name: 'donor_candidate_first_name',
    candidate_middle_name: 'donor_candidate_middle_name',
    candidate_prefix: 'donor_candidate_prefix',
    candidate_suffix: 'donor_candidate_suffix',
    candidate_office: 'donor_candidate_office',
    candidate_state: 'donor_candidate_state',
    candidate_district: 'donor_candidate_district',
    date: 'contribution_date',
    memo_code: 'memo_code',
    amount: 'contribution_amount',
    balance: '',
    payment_to_date: '',
    interest_rate: '',
    due_date: '',
    secured: '',
    aggregate: 'contribution_aggregate',
    purpose_description: 'contribution_purpose_descrip',
    text4000: 'text4000',
    category_code: '',
    election_code: 'election_code',
    election_other_description: 'election_other_description',
  };
}
