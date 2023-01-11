import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JOINT_FUNDRAISING_TRANSFER';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

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
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

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
