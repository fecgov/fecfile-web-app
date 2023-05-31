import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OTHER_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupC } from '../transaction-groups/transaction-group-c.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class OTHER_RECEIPT extends SchATransactionType {
  transactionGroup = new TransactionGroupC();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OTHER_RECEIPTS);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.OTHER_RECEIPTS,
      aggregation_group: AggregationGroups.OTHER_RECEIPTS,
    });
  }
}
