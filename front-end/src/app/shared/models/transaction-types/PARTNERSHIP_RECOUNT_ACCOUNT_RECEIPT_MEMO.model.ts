import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO extends SchaTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO
  );
  schema = schema;
  override updateParentOnSave = true;
  override subTransactionTypes = [ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO];
  override navigationControls: TransactionNavigationControls = getChildNavigationControls(
    LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO)
  );

  override generatePurposeDescription(): string {
    return 'Recount Account Partnership Attribution';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_RECOUNT_ACCOUNT_RECEIPT_MEMO,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
