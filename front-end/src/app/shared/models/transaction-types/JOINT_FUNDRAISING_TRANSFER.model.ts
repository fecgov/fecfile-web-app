import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/JOINT_FUNDRAISING_TRANSFER';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { SubTransactionGroup } from '../transaction/transaction-type.model';
import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class JOINT_FUNDRAISING_TRANSFER extends SchATransactionType {
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
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

  override get isReattributable(): boolean {
    return false;
  }

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
