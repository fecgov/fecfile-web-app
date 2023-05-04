import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_JF_TRANSFER_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionNavigationControls, getChildNavigationControls } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';

export class INDIVIDUAL_JF_TRANSFER_MEMO extends SchATransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO);
  schema = schema;
  override shortName = 'Individual';
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  override generatePurposeDescription(transaction: SchATransaction): string {
    return `JF Memo: ${(transaction.parent_transaction as SchATransaction).contributor_organization_name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
