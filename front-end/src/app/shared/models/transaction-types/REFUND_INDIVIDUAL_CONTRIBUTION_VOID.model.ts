import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/INDIVIDUAL_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION,
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';

export class REFUND_INDIVIDUAL_CONTRIBUTION_VOID extends SchBTransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID);
  schema = schema;
  override negativeAmountValueOnly = true;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28A',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_INDIVIDUAL_CONTRIBUTION_VOID,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
