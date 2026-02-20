import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ORGANIZATION_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';

export class REFUND_UNREGISTERED_CONTRIBUTION_VOID extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
  );
  schema = schema;
  override negativeAmountValueOnly = true;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override readonly initializationData = {
    form_type: 'SB28A',
    transaction_type_identifier: ScheduleBTransactionTypes.REFUND_UNREGISTERED_CONTRIBUTION_VOID,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
