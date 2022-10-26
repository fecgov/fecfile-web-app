import { TransactionType, isNewTransaction } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/OFFSET_TO_OPERATING_EXPENDITURES';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class OFFSET_TO_OPERATING_EXPENDITURES implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'B';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES);
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
      form_type: 'SA15',
      transaction_type_identifier: ScheduleATransactionTypes.OFFSETS_TO_OPERATING_EXPENDITURES,
      aggregation_group: AggregationGroups.LINE_15,
    });
  }
}
