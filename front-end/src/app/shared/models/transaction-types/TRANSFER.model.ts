import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRANSFER';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';

export class TRANSFER implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRANSFER);
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.TRANSFER,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
