import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_REFUNDS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { GROUP_B } from 'app/shared/utils/transaction-type-properties';

export class REFUND_INDIVIDUAL_CONTRIBUTION extends SchBTransactionType {
  transactionGroup = new TransactionGroupB();
  formProperties = GROUP_B;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION);
  schema = schema;
  override showAggregate = false;
  override isRefund = true;
  override contactTypeOptions = [ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28A',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
