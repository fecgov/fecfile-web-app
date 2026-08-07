import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_RECEIPT';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class PARTNERSHIP_RECEIPT extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_RECEIPT);
  schema = schema;
  override subTransactionConfig = [ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override purposeDescriptionLabelNotice =
    'If Partnership Receipt is saved without a Partnership Memo, this will read "Partnership attributions do not meet itemization threshold". If a Partnership Memo is added, it will read "See Partnership Attribution(s) below".';
  override generatePurposeDescription(transaction: SchATransaction): string {
    if (transaction.children.some((child) => child.itemized === true)) {
      return 'See Partnership Attribution(s) below';
    }
    return 'Partnership attributions do not meet itemization threshold';
  }
  override get isReattributable(): boolean {
    return false;
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
