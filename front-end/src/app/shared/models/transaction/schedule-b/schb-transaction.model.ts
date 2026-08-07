import { plainToInstance, Transform } from 'class-transformer';
import { Transaction } from '../transaction.model';
import { BaseModel } from '../../base.model';
import { getFromJSON, TransactionTypeUtils } from '../../../utils/transaction-type.utils';
import { RedesignationToUtils } from '../../../utils/reatt-redes/redesignation-to.utils';
import { RedesignationFromUtils } from '../../../utils/reatt-redes/redesignation-from.utils';
import { RedesignatedUtils } from '../../../utils/reatt-redes/redesignated.utils';
import { ReattRedesTypes } from '../../../utils/reatt-redes/reatt-redes.types';
import type { AggregationGroups } from '../agregation-groups.model';

export class SchBTransaction extends Transaction {
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
  election_code: string | undefined;
  election_other_description: string | undefined;
  @Transform(BaseModel.dateTransform) expenditure_date: Date | undefined;
  expenditure_amount: number | undefined;
  aggregate_amount: number | undefined;
  aggregation_group: AggregationGroups | undefined;
  semi_annual_refunded_bundled_amt: number | undefined;
  expenditure_purpose_descrip: string | undefined;
  category_code: string | undefined;
  beneficiary_committee_fec_id: string | undefined;
  beneficiary_committee_name: string | undefined;
  beneficiary_candidate_fec_id: string | undefined;
  beneficiary_candidate_last_name: string | undefined;
  beneficiary_candidate_first_name: string | undefined;
  beneficiary_candidate_middle_name: string | undefined;
  beneficiary_candidate_prefix: string | undefined;
  beneficiary_candidate_suffix: string | undefined;
  beneficiary_candidate_office: string | undefined;
  beneficiary_candidate_state: string | undefined;
  beneficiary_candidate_district: string | undefined;
  conduit_name: string | undefined;
  conduit_street_1: string | undefined;
  conduit_street_2: string | undefined;
  conduit_city: string | undefined;
  conduit_state: string | undefined;
  conduit_zip: string | undefined;
  memo_code: boolean | undefined;
  memo_text_description: string | undefined;
  reference_to_si_or_sl_system_code_that_identifies_the_account: string | undefined;
  reattribution_redesignation_tag: string | undefined;
  reatt_redes_total?: number; // Amount of total money that has been redesignated for a transaction.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchBTransaction {
    let transaction = plainToInstance(SchBTransaction, json);
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

    switch (transaction.reattribution_redesignation_tag) {
      case ReattRedesTypes.REDESIGNATED: {
        transaction = RedesignatedUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REDESIGNATION_TO: {
        transaction = RedesignationToUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REDESIGNATION_FROM: {
        transaction = RedesignationFromUtils.overlayTransactionProperties(transaction);
        break;
      }
    }
    if (depth > 0 && transaction.reatt_redes) {
      transaction.reatt_redes = getFromJSON(transaction.reatt_redes, depth - 1);
    }

    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return [
      'back_reference_tran_id_number',
      'back_reference_sched_name',
      //'beneficiary_committee_name',
      ...super.getFieldsNotToValidate(),
    ];
  }
}
