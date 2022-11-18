import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT
  );
  schema = schema;
  transaction = undefined;
  childTransactionType = undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

  contributionPurposeDescripReadonly(): string {
    return 'Non-contribution Account Receipt';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.BUSINESS_LABOR_NON_CONTRIBUTION_ACCOUNT,
      aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
    });
  }
}
