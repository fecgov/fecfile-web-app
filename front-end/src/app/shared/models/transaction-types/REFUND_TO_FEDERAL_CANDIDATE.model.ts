import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/REFUND_TO_FEDERAL_CANDIDATE';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_H } from 'app/shared/utils/transaction-type-properties';

export class REFUND_TO_FEDERAL_CANDIDATE extends SchATransactionType {
  formFieldsConfig = GROUP_H;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE);
  schema = schema;
  override hasCandidateCommittee = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override contact2IsRequired = true;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA16',
      transaction_type_identifier: ScheduleATransactionTypes.REFUND_TO_FEDERAL_CANDIDATE,
      aggregation_group: AggregationGroups.LINE_16,
    });
  }
}
