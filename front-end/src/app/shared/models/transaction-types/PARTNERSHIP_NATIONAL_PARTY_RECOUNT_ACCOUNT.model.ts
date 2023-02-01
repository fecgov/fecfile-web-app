import { LabelUtils } from 'app/shared/utils/label.utils';
import { TransactionTypeUtils } from 'app/shared/utils/transaction-type.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_RECEIPTS';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT extends SchaTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT
  );
  schema = schema;
  override subTransactionTypes = [ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO];
  override childTransactionType = TransactionTypeUtils.factory(
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT_MEMO
  );
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Partnership attributions do not require itemization". If a Partnership Memo is added, it will read "See Partnership Attribution(s) below".';

  override purposeDescriptionGenerator(): string {
    if (this.transaction?.children && this.transaction?.children.length > 0) {
      return 'Recount/Legal Proceedings Account (See Partnership Attribution(s) below)';
    }
    return 'Recount/Legal Proceedings Account (Partnership attributions do not require itemization)';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_RECOUNT_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
    });
  }
}
