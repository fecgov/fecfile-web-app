import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_REFUNDS';
import { ContactTypes } from '../contact.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupB } from '../transaction-groups/transaction-group-b.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class REFUND_INDIVIDUAL_CONTRIBUTION_VOID extends SchBTransactionType {
  transactionGroup = new TransactionGroupB();
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override showAggregate = false;
  override isRefund = true;
  override contactTypeOptions = [ContactTypes.INDIVIDUAL, ContactTypes.ORGANIZATION];
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28A',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
