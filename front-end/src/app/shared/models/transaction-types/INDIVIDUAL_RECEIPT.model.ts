import { TransactionType, isNewTransaction } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECEIPT';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class INDIVIDUAL_RECEIPT implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'A';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
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
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
