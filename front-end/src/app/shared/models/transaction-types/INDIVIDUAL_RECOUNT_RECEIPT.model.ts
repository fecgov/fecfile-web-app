import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECOUNT_RECEIPT';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class INDIVIDUAL_RECOUNT_RECEIPT extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'A';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT);
  schema = schema;
  override transaction?: SchATransaction;
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  override generatePurposeDescription(): string {
    return `Recount Account`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
