import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ORGANIZATION_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class REFUND_UNREGISTERED_CONTRIBUTION extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION);
  schema = schema;
  override showAggregate = false;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction(properties = {}) {
    return SchBTransaction.fromJSON({
      ...{
        form_type: 'SB28A',
        transaction_type_identifier: ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION,
        aggregation_group: AggregationGroups.GENERAL,
      },
      ...properties,
    });
  }
}
