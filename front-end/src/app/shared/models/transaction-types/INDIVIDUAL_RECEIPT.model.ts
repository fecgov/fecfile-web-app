import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_RECEIPT';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from '../scha-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class INDIVIDUAL_RECEIPT extends SchaTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.INDIVIDUAL_RECEIPT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.INDIVIDUAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
