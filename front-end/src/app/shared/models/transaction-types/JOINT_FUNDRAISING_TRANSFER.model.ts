import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JOINT_FUNDRAISING_TRANSFER';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction-type.model';
import { AggregationGroups } from '../transaction.model';

export class JOINT_FUNDRAISING_TRANSFER extends SchATransactionType {
  
  transactionGroup = new TransactionGroupE();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
  schema = schema;
  override subTransactionConfig = new SubTransactionGroup('Joint Fundraising Transfer Memo', [
    ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.TRIBAL_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTNERSHIP_JF_TRANSFER_MEMO,
  ]);
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Transfer of Joint Fundraising Proceeds';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA12',
      transaction_type_identifier: ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
