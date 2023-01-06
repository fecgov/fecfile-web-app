import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_RECEIPT';
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

export class TRIBAL_RECEIPT extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRIBAL_RECEIPT);
  schema = schema;
  override transaction?: SchATransaction;
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  override generatePurposeDescription(): string {
    return 'Tribal Receipt';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
