import { Transform } from 'class-transformer';
import { Transaction } from './transaction.model';
import { BaseModel } from './base.model';
import type { AggregationGroups } from './type-enums';

export class SchFTransaction extends Transaction {
  coordinated_expenditures: boolean | undefined;
  designating_committee_id_number: string | undefined;
  designating_committee_name: string | undefined;
  subordinate_committee_id_number: string | undefined;
  subordinate_committee_name: string | undefined;
  subordinate_street_1: string | undefined;
  subordinate_street_2: string | undefined;
  subordinate_city: string | undefined;
  subordinate_state: string | undefined;
  subordinate_zip: string | undefined;
  entity_type: string | undefined;
  payee_organization_name: string | undefined;
  payee_last_name: string | undefined;
  payee_first_name: string | undefined;
  payee_middle_name: string | undefined;
  payee_prefix: string | undefined;
  payee_suffix: string | undefined;
  payee_street_1: string | undefined;
  payee_street_2: string | undefined;
  payee_city: string | undefined;
  payee_state: string | undefined;
  payee_zip: string | undefined;
  @Transform(BaseModel.dateTransform) expenditure_date: Date | undefined;
  expenditure_amount: number | undefined;
  aggregation_group: AggregationGroups | undefined;
  general_election_year: string | undefined;
  aggregate_general_elec_expended: number | undefined; // calculated field
  expenditure_purpose_description: string | undefined;
  category_code: string | undefined;
  payee_committee_id_number: string | undefined;
  payee_candidate_id_number: string | undefined;
  payee_candidate_last_name: string | undefined;
  payee_candidate_first_name: string | undefined;
  payee_candidate_middle_name: string | undefined;
  payee_candidate_prefix: string | undefined;
  payee_candidate_suffix: string | undefined;
  payee_candidate_office: string | undefined;
  payee_candidate_state: string | undefined;
  payee_candidate_district: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;

  override getFieldsNotToSave(): string[] {
    return ['aggregate_general_elec_expended', ...super.getFieldsNotToSave()];
  }

  override getFieldsNotToValidate(): string[] {
    return [
      'back_reference_tran_id_number',
      'back_reference_sched_name',
      'aggregate_general_elec_expended',
      ...super.getFieldsNotToValidate(),
    ];
  }
}
