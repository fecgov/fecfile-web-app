import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_RECEIPT_FROM_PERSON_RETURN';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';

export class UNREGISTERED_RECEIPT_FROM_PERSON_RETURN extends SchATransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
