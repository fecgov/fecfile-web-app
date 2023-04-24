import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_PAC_REFUNDS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';

export class REFUND_PARTY_CONTRIBUTION_VOID extends SchBTransactionType {
  componentGroupId = 'E';
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID);
  schema = schema;
  override showAggregate = false;
  override isRefundAggregate = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override negativeAmountValueOnly = true;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28B',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION_VOID,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
