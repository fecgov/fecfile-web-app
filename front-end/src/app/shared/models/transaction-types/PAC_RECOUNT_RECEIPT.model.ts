import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_RECOUNT_RECEIPT';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { SchaTransactionType } from './SchaTransactionType.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';

export class PAC_RECOUNT_RECEIPT extends SchaTransactionType {
  componentGroupId = 'F';
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount Account';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_RECOUNT_RECEIPT,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
