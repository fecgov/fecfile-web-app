import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  SAVE_ANOTHER_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'A';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT
  );
  schema = schema;
  transaction?: SchATransaction;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  generateContributionPurposeDescription(): string {
    return 'Non-contribution Account Receipt';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT_NON_CONTRIBUTION_ACCOUNT,
      aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
    });
  }
}
