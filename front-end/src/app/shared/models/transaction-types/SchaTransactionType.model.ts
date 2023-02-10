import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';

export abstract class SchaTransactionType extends TransactionType {
  scheduleId = 'A';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
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
    date: 'contribution_date',
    dateLabel: 'DATE RECEIVED',
    memo_code: 'memo_code',
    amount: 'contribution_amount',
    aggregate: 'contribution_aggregate',
    purpose_descrip: 'contribution_purpose_descrip',
    purposeDescripLabel: 'CONTRIBUTION PURPOSE DESCRIPTION',
    memo_text_input: 'memo_text_input',
    category_code: '',
  };

  override generatePurposeDescriptionLabel(): string {
    if (this.generatePurposeDescription !== undefined) {
      return '(SYSTEM-GENERATED)';
    } else if (this.schema.required.includes('contribution_purpose_descrip')) {
      return '(REQUIRED)';
    }
    return '(OPTIONAL)';
  }
}
