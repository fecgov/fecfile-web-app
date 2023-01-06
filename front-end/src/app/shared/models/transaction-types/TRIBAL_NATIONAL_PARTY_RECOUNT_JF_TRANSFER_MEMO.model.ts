import { hasNoContact, isNewTransaction } from 'app/shared/models/transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO';
import {
  AggregationGroups, SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes
} from '../scha-transaction.model';
import {
  NavigationAction,
  NavigationControl,
  NavigationDestination,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'D';
  isDependentChild = false;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO
  );
  schema = schema;
  override transaction?: SchATransaction;
  override navigationControls?: TransactionNavigationControls = new TransactionNavigationControls(
    [
      new NavigationControl(
        NavigationAction.SAVE,
        NavigationDestination.ANOTHER,
        'Save & add another Memo',
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

  override generatePurposeDescription(): string {
    return `Recount/Legal Proceedings Account JF Memo: ${
      (this.transaction?.parent_transaction as SchATransaction)?.contributor_organization_name
    }`;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_RECOUNT_JF_TRANSFER_MEMO,
      back_reference_sched_name: 'SA17',
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
