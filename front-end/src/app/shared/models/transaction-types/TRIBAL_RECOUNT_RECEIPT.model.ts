import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_RECOUNT_RECEIPT';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';

export class TRIBAL_RECOUNT_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT);
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  generatePurposeDescription(): string {
    return 'Recount Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
