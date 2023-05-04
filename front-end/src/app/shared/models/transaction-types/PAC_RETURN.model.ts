import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypes, ScheduleATransactionTypeLabels } from '../scha-transaction.model';
import { AggregationGroups } from '../transaction.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PAC_RETURN';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';
import { TransactionGroupE } from '../transaction-groups/transaction-group-e';

export class PAC_RETURN extends SchATransactionType {
  
  transactionGroup = new TransactionGroupE();
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_RETURN);
  schema = schema;
  override negativeAmountValueOnly = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11C',
      transaction_type_identifier: ScheduleATransactionTypes.PAC_RETURN,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
