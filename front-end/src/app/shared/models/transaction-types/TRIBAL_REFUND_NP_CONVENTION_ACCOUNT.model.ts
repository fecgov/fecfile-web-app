import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_TRIBAL_REFUNDS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';

export class TRIBAL_REFUND_NP_CONVENTION_ACCOUNT extends SchBTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT);
  schema = schema;
  override showAggregate = false;
  override isRefundAggregate = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.TRIBAL_REFUND_NP_CONVENTION_ACCOUNT,
      aggregation_group: AggregationGroups.NATIONAL_PARTY_CONVENTION_ACCOUNT,
    });
  }
  override generatePurposeDescription(): string {
    return 'Pres. Nominating Convention Account: Refund';
  }
}
