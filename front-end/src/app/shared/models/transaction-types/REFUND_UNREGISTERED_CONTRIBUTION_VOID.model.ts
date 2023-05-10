import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupD } from '../transaction-groups/transaction-group-d.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class REFUND_UNREGISTERED_CONTRIBUTION_VOID extends SchBTransactionType {
  transactionGroup = new TransactionGroupD();
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID
  );
  schema = schema;
  override negativeAmountValueOnly = true;
  override showAggregate = false;
  override isRefundAggregate = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28A',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
