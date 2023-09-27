import { STANDARD_CONTROLS } from './transaction-navigation-controls.model';
import { TransactionTemplateMapType, TransactionType } from './transaction-type.model';
import { isPulledForwardLoan, Transaction } from './transaction.model';

export abstract class SchC1TransactionType extends TransactionType {
  scheduleId = 'C1';
  apiEndpoint = '/transactions/schedule-c1';

  // Labels
  override amountInputHeader = 'Loan information';

  override getInheritedFields = (transaction: Transaction) =>
    isPulledForwardLoan(transaction?.parent_transaction) ? undefined : this.inheritedFields;

  override getNavigationControls = (transaction: Transaction) =>
    isPulledForwardLoan(transaction?.parent_transaction) ? STANDARD_CONTROLS : this.navigationControls;

  override getFooter = (transaction?: Transaction) =>
    isPulledForwardLoan(transaction?.parent_transaction) ? undefined : this.footer;

  override getUseParentContact = (transaction?: Transaction) =>
    isPulledForwardLoan(transaction?.parent_transaction) ? false : this.useParentContact;

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
    interest_rate: 'loan_interest_rate',
    interest_rate_setting: 'loan_interest_rate_field_setting',
    due_date: 'loan_due_date',
    due_date_setting: 'loan_due_date_field_setting',
    secured: 'collateral',
    aggregate: '',
    purpose_description: '',
    text4000: '',
    category_code: '',
    election_code: '',
    election_other_description: '',
    secondary_name: 'ind_name_account_location',
    secondary_street_1: 'account_street_1',
    secondary_street_2: 'account_street_2',
    secondary_city: 'account_city',
    secondary_state: 'account_state',
    secondary_zip: 'account_zip',
    signatory_1_last_name: 'treasurer_last_name',
    signatory_1_first_name: 'treasurer_first_name',
    signatory_1_middle_name: 'treasurer_middle_name',
    signatory_1_prefix: 'treasurer_prefix',
    signatory_1_suffix: 'treasurer_suffix',
    signatory_1_date: 'treasurer_date_signed',
    signatory_2_last_name: 'authorized_last_name',
    signatory_2_first_name: 'authorized_first_name',
    signatory_2_middle_name: 'authorized_middle_name',
    signatory_2_prefix: 'authorized_prefix',
    signatory_2_suffix: 'authorized_suffix',
    signatory_2_title: 'authorized_title',
    signatory_2_date: 'authorized_date_signed',
  };
}
