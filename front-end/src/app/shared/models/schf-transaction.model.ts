import { plainToInstance, Transform } from 'class-transformer';
import { AggregationGroups, Transaction } from './transaction.model';
import { LabelList } from '../utils/label.utils';
import { BaseModel } from './base.model';
import { getFromJSON, TransactionTypeUtils } from '../utils/transaction-type.utils';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchFTransaction {
    const transaction = plainToInstance(SchFTransaction, json);
    if (transaction.transaction_type_identifier) {
      const transactionType = TransactionTypeUtils.factory(transaction.transaction_type_identifier);
      transaction.setMetaProperties(transactionType);
    }
    if (depth > 0 && transaction.parent_transaction) {
      transaction.parent_transaction = getFromJSON(transaction.parent_transaction, depth - 1);
    }
    if (depth > 0 && transaction.children) {
      transaction.children = transaction.children.map(function (child) {
        return getFromJSON(child, depth - 1);
      });
    }
    return transaction;
  }
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

export enum ScheduleFTransactionTypes {
  COORDINATED_PARTY_EXPENDITURE = 'COORDINATED_PARTY_EXPENDITURE',
  COORDINATED_PARTY_EXPENDITURE_VOID = 'COORDINATED_PARTY_EXPENDITURE_VOID',
}

export const ScheduleFTransactionTypeLabels: LabelList = [
  [ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE, 'Coordinated Party Expenditure'],
  [ScheduleFTransactionTypes.COORDINATED_PARTY_EXPENDITURE_VOID, 'Void of Coordinated Party Expenditure'],
];
