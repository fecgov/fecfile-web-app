import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';

export class JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT extends SchATransactionType {
  transactionGroup = new TransactionGroupE();
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT
  );
  schema = schema;
  override subTransactionConfig = new SubTransactionGroup(
    'JF Transfer - National Party Headquarters Buildings Account Memo',
    [
      ScheduleATransactionTypes.INDIVIDUAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PAC_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.TRIBAL_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
      ScheduleATransactionTypes.PARTNERSHIP_NATIONAL_PARTY_HEADQUARTERS_JF_TRANSFER_MEMO,
    ]
  );
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Headquarters Buildings Account Transfer of JF Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.JF_TRANSFER_NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_HEADQUARTERS_ACCOUNT,
    });
  }
}
