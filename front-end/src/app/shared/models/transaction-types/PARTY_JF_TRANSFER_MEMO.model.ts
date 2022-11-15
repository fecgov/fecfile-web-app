import { TransactionType } from 'app/shared/interfaces/transaction-type.interface';
import { hasNoContact, isNewTransaction, Transaction } from 'app/shared/interfaces/transaction.interface';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_JF_TRANSFER_MEMO';
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
  SAVE_LIST_CONTROL,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';

export class PARTY_JF_TRANSFER_MEMO implements TransactionType {
  scheduleId = 'A';
  componentGroupId = 'F';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO);
  schema = schema;
  transaction?: Transaction;
  childTransactionType = undefined;
  navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add another Joint Fundraiser Transfer Memo',
        'p-button-warning',
        hasNoContact,
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
    return `JF Memo: ${(this.transaction?.parent_transaction as SchATransaction).contributor_organization_name}`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA12',
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
