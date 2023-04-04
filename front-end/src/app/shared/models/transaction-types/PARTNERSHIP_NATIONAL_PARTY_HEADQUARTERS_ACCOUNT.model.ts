import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_NATIONAL_PARTY_RECEIPTS';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { AggregationGroups } from '../transaction.model';

export class PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT extends SchATransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  override subTransactionConfig = [ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Partnership attributions do not require itemization". If a Partnership Memo is added, it will read "See Partnership Attribution(s) below".';

  override generatePurposeDescription(transaction: SchATransaction): string {
    if (transaction.children && transaction.children.length > 0) {
      return 'Headquarters Buildings Account (See Partnership Attribution(s) below)';
    }
    return 'Headquarters Buildings Account (Partnership attributions do not require itemization)';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
