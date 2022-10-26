import { TransactionType, isNewTransaction } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_RECEIPT';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class TRIBAL_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRIBAL_RECEIPT);
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
