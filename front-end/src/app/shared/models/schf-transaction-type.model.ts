import { FormGroup } from '@angular/forms';
import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';
import { ScheduleIds } from './transaction.model';

export abstract class SchFTransactionType extends TransactionType {
  scheduleId = ScheduleIds.F;

  // Form layout
  override contact2IsRequired = () => true;
  override contact3IsRequired = true;
  override contact4IsRequired = (form: FormGroup) =>
    form.get('filer_designated_to_make_coordinated_expenditures')?.value === true;
  override contact5IsRequired = (form: FormGroup) =>
    form.get('filer_designated_to_make_coordinated_expenditures')?.value === false;
  override candidateInfoPosition = 'high';

  //Labels
  override amountInputHeader = 'Expenditure information';
  override purposeDescripLabel = 'PURPOSE OF DISBURSEMENT';

  // Mapping of schedule fields to the group input component form templates
  templateMap: TransactionTemplateMapType = {
    // Form fields
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
    committee_fec_id: 'payee_committee_id_number',
    committee_name: 'payee_committee_name',
    candidate_fec_id: 'payee_candidate_id_number',
    candidate_last_name: 'payee_candidate_last_name',
    candidate_first_name: 'payee_candidate_first_name',
    candidate_middle_name: 'payee_candidate_middle_name',
    candidate_prefix: 'payee_candidate_prefix',
    candidate_suffix: 'payee_candidate_suffix',
    candidate_office: 'payee_candidate_office',
    candidate_state: 'payee_candidate_state',
    candidate_district: 'payee_candidate_district',
    date: 'expenditure_date',
    date2: '',
    memo_code: 'memo_code',
    amount: 'expenditure_amount',
    balance: '',
    payment_to_date: '',
    interest_rate: '',
    due_date: '',
    interest_rate_setting: '',
    due_date_setting: '',
    secured: '',
    aggregate: '',
    calendar_ytd: '',
    aggregate_general_elec_expended: 'aggregate_general_elec_expended',
    general_election_year: 'general_election_year',
    purpose_description: 'expenditure_purpose_descrip',
    text4000: 'text4000',
    category_code: 'category_code',
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
    quaternary_committee_fec_id: 'designating_committee_id_number',
    quaternary_committee_name: 'designating_committee_name',
    quinary_committee_fec_id: 'subordinate_committee_id_number',
    quinary_committee_name: 'subordinate_committee_name',
    quinary_street_1: 'subordinate_street_1',
    quinary_street_2: 'subordinate_street_2',
    quinary_city: 'subordinate_city',
    quinary_state: 'subordinate_state',
    quinary_zip: 'subordinate_zip',
  };
}
