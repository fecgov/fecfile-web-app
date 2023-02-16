import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_MEMO';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchaTransactionType } from '../scha-transaction-type.model';

export class PARTNERSHIP_MEMO extends SchaTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_MEMO);
  schema = schema;
  override updateParentOnSave = true;
  override subTransactionTypes = [ScheduleATransactionTypes.PARTNERSHIP_MEMO];
  override navigationControls: TransactionNavigationControls = getChildNavigationControls(
    LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECEIPT)
  );

  override generatePurposeDescription(): string {
    return 'Partnership Attribution';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_MEMO,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
