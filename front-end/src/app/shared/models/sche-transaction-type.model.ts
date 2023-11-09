import { TransactionType, TransactionTemplateMapType } from './transaction-type.model';
import { ScheduleIds } from './transaction.model';
import { hasFields, CANDIDATE_FIELDS } from '../utils/transaction-type-properties';
import { FormGroup } from '@angular/forms';

export abstract class SchETransactionType extends TransactionType {
  scheduleId = ScheduleIds.E;

  override contactTitle = 'Payee';
  override amountInputHeader = 'Expenditure information';
  override dateLabel = 'DISBURSEMENT DATE';
  override date2Label = 'DISSEMINATION DATE';
  override aggregateLabel = 'CALENDAR YEAR-TO-DATE';
  override purposeDescripLabel = 'PURPOSE OF EXPENDITURE';
  override signatoryOneHeader = 'Committee treasurer';
  override committeeCandidateHeader = 'Candidate information';
  override hasCandidateInformation(form?: FormGroup): boolean {
    return hasFields(this.formFields, CANDIDATE_FIELDS) && !!form?.get('support_oppose_code')?.value;
  }

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
    committee_fec_id: 'payee_cmtte_fec_id_number',
    committee_name: '',
    candidate_fec_id: 'so_candidate_id_number',
    candidate_last_name: 'so_candidate_last_name',
    candidate_first_name: 'so_candidate_first_name',
    candidate_middle_name: 'so_candidate_middle_name',
    candidate_prefix: 'so_candidate_prefix',
    candidate_suffix: 'so_candidate_suffix',
    candidate_office: 'so_candidate_office',
    candidate_state: 'so_candidate_state',
    candidate_district: 'so_candidate_district',
    date: 'disbursement_date',
    date2: 'dissemination_date',
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
    calendar_ytd: 'calendar_ytd',
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
    signatory_1_last_name: 'completing_last_name',
    signatory_1_first_name: 'completing_first_name',
    signatory_1_middle_name: 'completing_middle_name',
    signatory_1_prefix: 'completing_prefix',
    signatory_1_suffix: 'completing_suffix',
    signatory_1_date: 'date_signed',
    signatory_2_last_name: '',
    signatory_2_first_name: '',
    signatory_2_middle_name: '',
    signatory_2_prefix: '',
    signatory_2_suffix: '',
    signatory_2_title: '',
    signatory_2_date: '',
  };
}
