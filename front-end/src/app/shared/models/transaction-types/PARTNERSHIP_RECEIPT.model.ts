import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_RECEIPT';
import {
  AggregationGroups,
  SchATransaction,
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { SchaTransactionType } from './SchaTransactionType.model';

export class PARTNERSHIP_RECEIPT extends SchaTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  schema = schema;
  override childTransactionTypes = [ScheduleATransactionTypes.PARTNERSHIP_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Partnership attributions do not require itemization". If a Partnership Memo is added, it will read "See Partnership Attribution(s) below".';
  override generatePurposeDescription(): string {
    if (this.transaction?.children && this.transaction?.children.length > 0) {
      return 'See Partnership Attribution(s) below';
    }
    return 'Partnership attributions do not require itemization';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
