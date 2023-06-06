import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchC2TransactionType extends TransactionType {
  scheduleId = 'C1';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
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
    date: '',
    dateLabel: '',
    memo_code: 'memo_code',
    amount: 'guaranteed_amount',
    amountInputHeader: 'Loan Information',
    aggregate: '',
    purpose_description: '',
    purposeDescripLabel: '',
    text4000: 'text4000',
    category_code: '',
    election_code: 'election_code',
    election_other_description: 'election_other_description',
  };
}
