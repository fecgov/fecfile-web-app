import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_RECOUNT_RECEIPT';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class PARTY_RECOUNT_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT);
  schema = schema;
  transaction?: SchATransaction;
  navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  generateContributionPurposeDescription(): string {
    return `Recount Account`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
