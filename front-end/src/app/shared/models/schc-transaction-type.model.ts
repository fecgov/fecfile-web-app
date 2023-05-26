import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchCTransactionType extends TransactionType {
  scheduleId = 'C';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    last_name: 'lender_last_name',
    first_name: 'lender_first_name',
    middle_name: 'lender_middle_name',
    prefix: 'lender_prefix',
    suffix: 'lender_suffix',
    street_1: 'lender_street_1',
    street_2: 'lender_street_2',
    city: 'lender_city',
    state: 'lender_state',
    zip: 'lender_zip',
    employer: '',
    occupation: '',
    organization_name: 'lender_organization_name',
    committee_fec_id: 'lender_committee_id_number',
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
    dateLabel: 'DATE',
    memo_code: 'memo_code',
    amount: 'loan_amount',
    amountInputHeader: 'Loan Information',
    candidateInputHeader: '',
    aggregate: '',
    purpose_description: '',
    purposeDescripLabel: '',
    text4000: 'text4000',
    category_code: '',
    election_code: 'election_code',
    election_other_description: 'election_other_description',
  };
}
