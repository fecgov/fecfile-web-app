import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from '../scha-transaction-type.model';
import { TransactionNavigationControls, getChildNavigationControls } from '../transaction-navigation-controls.model';

export class TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO extends SchaTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls(
    LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER)
  );

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `Recount/Legal Proceedings Account JF Memo: ${
      (transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA17',
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
