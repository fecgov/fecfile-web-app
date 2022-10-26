import { TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRANSFER';
import { Transaction } from '../../interfaces/transaction.interface';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class TRANSFER implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.TRANSFER);
  schema = schema;
  transaction: Transaction | undefined;
  contact = undefined;
  parent: SchATransaction | undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add another Memo',
        'p-button-warning',
        TRANSFER.isTransactionExisting,
        'pi pi-plus'
      ),
    ],
    [new NavigationControl(NavigationAction.CANCEL, NavigationDestination.LIST, 'Cancel')],
    [new NavigationControl(NavigationAction.SAVE, NavigationDestination.LIST, 'Save & view all transactions')]
  );

  static isTransactionExisting(transaction?: Transaction): boolean {
    return !!transaction?.id;
  }

  contributionPurposeDescripReadonly(): string {
    return '';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.TRANSFER,
      back_reference_sched_name: 'SA12',
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
