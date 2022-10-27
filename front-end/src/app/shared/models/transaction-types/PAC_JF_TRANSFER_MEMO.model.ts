import { hasContact, isNewTransaction, TransactionType } from '../../interfaces/transaction-type.interface';
import {
  SchATransaction,
  ScheduleATransactionTypes,
  ScheduleATransactionTypeLabels,
  AggregationGroups,
} from '../scha-transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_JF_TRANSFER_MEMO';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class PAC_JF_TRANSFER_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO);
  schema = schema;
  transaction = undefined;
  parentTransaction: SchATransaction | undefined = undefined;
  childTransactionType = undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add another JF Transfer Memo',
        'p-button-warning',
        hasContact,
        isNewTransaction,
        'pi pi-plus'
      ),
    ],
    [
      new NavigationControl(
        NavigationAction.CANCEL,
        NavigationDestination.PARENT,
        'Back to Joint Fundraising Transfer',
        'p-button-secondary'
      ),
    ],
    [SAVE_LIST_CONTROL]
  );

  contributionPurposeDescripReadonly(): string {
    return `Joint Fundraising Memo: ${this.parentTransaction?.contributor_organization_name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA12',
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
