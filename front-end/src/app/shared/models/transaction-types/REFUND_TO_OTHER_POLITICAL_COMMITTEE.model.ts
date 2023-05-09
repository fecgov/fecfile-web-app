import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/REFUND_TO_OTHER_POLITICAL_COMMITTEE';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupI } from '../transaction-groups/transaction-group-i.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class REFUND_TO_OTHER_POLITICAL_COMMITTEE extends SchATransactionType {
  transactionGroup = new TransactionGroupI();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA16',
      transaction_type_identifier: ScheduleATransactionTypes.REFUND_TO_OTHER_POLITICAL_COMMITTEE,
      aggregation_group: AggregationGroups.LINE_16,
    });
  }
}
