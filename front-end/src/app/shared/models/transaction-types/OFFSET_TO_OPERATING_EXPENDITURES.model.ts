import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPERATING_EXPENDITURES';
import {
  AggregationGroups, SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class OFFSET_TO_OPERATING_EXPENDITURES extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'B';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES);
  schema = schema;
  override transaction?: SchATransaction;
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSET_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.LINE_15,
    });
  }
}
