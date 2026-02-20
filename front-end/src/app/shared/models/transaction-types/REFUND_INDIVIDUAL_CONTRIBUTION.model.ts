import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';
import {
  INDIVIDUAL_ORGANIZATION,
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes, AggregationGroups } from '../type-enums';

export class REFUND_INDIVIDUAL_CONTRIBUTION extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION);
  schema = schema;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override readonly initializationData = {
    form_type: 'SB28A',
    transaction_type_identifier: ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
