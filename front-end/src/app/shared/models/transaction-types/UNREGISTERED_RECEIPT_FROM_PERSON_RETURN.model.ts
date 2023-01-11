import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_RECEIPT_FROM_PERSON_RETURN';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class UNREGISTERED_RECEIPT_FROM_PERSON_RETURN implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN
  );
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.UNREGISTERED_RECEIPT_FROM_PERSON_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
