import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JOINT_FUNDRAISING_TRANSFER';
import { TransactionType, isNewTransaction } from '../../interfaces/transaction-type.interface';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class JOINT_FUNDRAISING_TRANSFER implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'E';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
  schema = schema;
  transaction = undefined;
  contact = undefined;
  parent = undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [new NavigationControl(NavigationAction.CANCEL, NavigationDestination.LIST, 'Cancel')],
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.LIST,
        'Save & view all transactions',
        'p-button-primary'
      ),
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add another',
        'p-button-info',
        isNewTransaction
      ),
    ]
  );

  contributionPurposeDescripReadonly(): string {
    return 'Transfer of Joint Fundraising Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
