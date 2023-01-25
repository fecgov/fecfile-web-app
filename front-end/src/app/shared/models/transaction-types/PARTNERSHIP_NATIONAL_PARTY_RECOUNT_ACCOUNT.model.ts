import { LabelUtils } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_RECEIPTS';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, 
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT);
  schema = schema;
  override subTransactionTypes = [
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO,
  ];
  override childTransactionType = TransactionTypeUtils.factory(
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO);
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL]
  );

  override generatePurposeDescription(): string {
    const account = 'Recount/Legal Proceedings Account';
    const memo: SchATransaction = this.childTransactionType?.transaction as SchATransaction;
    if (memo && memo.form_type) {
      return account + ' (See Partnership Attribution(s) below)'
    }
    return account + ' (Partnership attributions do not require itemization)';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
