import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTY_PAC_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_EFI_FOR_B } from 'app/shared/utils/transaction-type-properties';

export class REFUND_PARTY_CONTRIBUTION extends SchBTransactionType {
  formProperties = GROUP_EFI_FOR_B;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION);
  schema = schema;
  override showAggregate = false;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28B',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_PARTY_CONTRIBUTION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
