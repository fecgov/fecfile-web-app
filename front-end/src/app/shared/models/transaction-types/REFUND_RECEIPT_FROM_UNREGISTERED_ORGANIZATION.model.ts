import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/UNREGISTERED_REFUNDS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import { ORGANIZATION_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
  );
  schema = schema;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override get isCloneableTransactionType(): boolean {
    return true;
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB28A',
      transaction_type_identifier: ScheduleBTransactionTypes.REFUND_RECEIPT_FROM_UNREGISTERED_ORGANIZATION,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
