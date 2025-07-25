import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';
import { ScheduleIds, Transaction, isPulledForwardLoan } from './transaction.model';
import { TransactionNavigationControls, SAVE_LIST_CONTROL } from './transaction-navigation-controls.model';

export abstract class SchCTransactionType extends TransactionType {
  scheduleId = ScheduleIds.C;

  // Labels
  override amountInputHeader = 'Loan information';

  override getNavigationControls(transaction: Transaction): TransactionNavigationControls | undefined {
    if (isPulledForwardLoan(transaction) && this.navigationControls) {
      return new TransactionNavigationControls(
        this.navigationControls.inlineControls,
        this.navigationControls.cancelControls,
        [SAVE_LIST_CONTROL],
      );
    }
    return this.navigationControls;
  }

  override getFooter(transaction?: Transaction): string | undefined {
    if (isPulledForwardLoan(transaction)) {
      return undefined;
    }
    return this.footer;
  }

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
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
    committee_name: 'lender_organization_name',
    candidate_fec_id: 'lender_candidate_id_number',
    candidate_last_name: 'lender_candidate_last_name',
    candidate_first_name: 'lender_candidate_first_name',
    candidate_middle_name: 'lender_candidate_middle_name',
    candidate_prefix: 'lender_candidate_prefix',
    candidate_suffix: 'lender_candidate_suffix',
    candidate_office: 'lender_candidate_office',
    candidate_state: 'lender_candidate_state',
    candidate_district: 'lender_candidate_district',
    date: 'loan_incurred_date',
    date2: '',
    memo_code: 'memo_code',
    amount: 'loan_amount',
    balance: 'loan_balance',
    payment_to_date: 'loan_payment_to_date',
    due_date: 'loan_due_date',
    due_date_setting: 'loan_due_date_field_setting',
    interest_rate: 'loan_interest_rate',
    interest_rate_setting: 'loan_interest_rate_field_setting',
    secured: 'secured',
    aggregate: '',
    calendar_ytd: '',
    aggregate_general_elec_expended: '',
    general_election_year: '',
    purpose_description: '',
    text4000: 'text4000',
    category_code: '',
    election_code: 'election_code',
    election_other_description: 'election_other_description',
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
    quaternary_committee_fec_id: '',
    quaternary_committee_name: '',
    quinary_committee_fec_id: '',
    quinary_committee_name: '',
    quinary_street_1: '',
    quinary_street_2: '',
    quinary_city: '',
    quinary_state: '',
    quinary_zip: '',
  };
}
