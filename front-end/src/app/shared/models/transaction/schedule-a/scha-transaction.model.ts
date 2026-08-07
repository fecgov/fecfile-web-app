import { plainToInstance, Transform } from 'class-transformer';
import { BaseModel } from '../../base.model';
import { getFromJSON, TransactionTypeUtils } from '../../../utils/transaction-type.utils';
import { ReattributionToUtils } from '../../../utils/reatt-redes/reattribution-to.utils';
import { ReattributionFromUtils } from '../../../utils/reatt-redes/reattribution-from.utils';
import { ReattributedUtils } from '../../../utils/reatt-redes/reattributed.utils';
import { ReattRedesTypes } from '../../../utils/reatt-redes/reatt-redes.types';
import { Transaction } from '../transaction.model';
import type { AggregationGroups } from '../agregation-groups.model';

export class SchATransaction extends Transaction {
  entity_type: string | undefined;
  contributor_organization_name: string | undefined;
  contributor_last_name: string | undefined;
  contributor_first_name: string | undefined;
  contributor_middle_name: string | undefined;
  contributor_prefix: string | undefined;
  contributor_suffix: string | undefined;
  contributor_street_1: string | undefined;
  contributor_street_2: string | undefined;
  contributor_city: string | undefined;
  contributor_state: string | undefined;
  contributor_zip: string | undefined;
  election_code: string | undefined;
  election_other_description: string | undefined;
  @Transform(BaseModel.dateTransform) contribution_date: Date | undefined;
  contribution_amount: number | undefined;
  contribution_aggregate: number | undefined;
  aggregation_group: AggregationGroups | undefined;
  contribution_purpose_descrip: string | undefined;
  contributor_employer: string | undefined;
  contributor_occupation: string | undefined;
  donor_committee_fec_id: string | undefined;
  donor_committee_name: string | undefined;
  donor_candidate_fec_id: string | undefined;
  donor_candidate_last_name: string | undefined;
  donor_candidate_first_name: string | undefined;
  donor_candidate_middle_name: string | undefined;
  donor_candidate_prefix: string | undefined;
  donor_candidate_suffix: string | undefined;
  donor_candidate_office: string | undefined;
  donor_candidate_state: string | undefined;
  donor_candidate_district: string | undefined;
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
  reatt_redes_total?: number; // Amount of total money that has been reattributed for a transaction.

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromJSON(json: any, depth = 2): SchATransaction {
    let transaction = plainToInstance(SchATransaction, json);
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
      case ReattRedesTypes.REATTRIBUTED: {
        transaction = ReattributedUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REATTRIBUTION_TO: {
        transaction = ReattributionToUtils.overlayTransactionProperties(transaction);
        break;
      }
      case ReattRedesTypes.REATTRIBUTION_FROM: {
        transaction = ReattributionFromUtils.overlayTransactionProperties(transaction);
        break;
      }
    }
    if (depth > 0 && transaction.reatt_redes) {
      transaction.reatt_redes = getFromJSON(transaction.reatt_redes, depth - 1);
    }
    return transaction;
  }

  override getFieldsNotToValidate(): string[] {
    return ['back_reference_tran_id_number', 'back_reference_sched_name', ...super.getFieldsNotToValidate()];
  }
}
