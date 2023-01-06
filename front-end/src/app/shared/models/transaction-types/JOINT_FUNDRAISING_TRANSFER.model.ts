import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JOINT_FUNDRAISING_TRANSFER';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes
} from '../scha-transaction.model';
import {
  CANCEL_CONTROL,
  SAVE_ANOTHER_CONTROL,
  SAVE_LIST_CONTROL,
  TransactionNavigationControls
} from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class JOINT_FUNDRAISING_TRANSFER extends SchaTransactionType {
  scheduleId = 'A';
  componentGroupId = 'E';
  isDependentChild = false;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.JOINT_FUNDRAISING_TRANSFER);
  schema = schema;
  override transaction?: SchATransaction;
  override subTransactionTypes = [
    ScheduleATransactionTypes.INDIVIDUAL_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PARTY_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.PAC_JF_TRANSFER_MEMO,
    ScheduleATransactionTypes.TRIBAL_JF_TRANSFER_MEMO,
  ];
  override navigationControls: TransactionNavigationControls = new TransactionNavigationControls(
    [],
    [CANCEL_CONTROL],
    [SAVE_LIST_CONTROL, SAVE_ANOTHER_CONTROL]
  );

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
