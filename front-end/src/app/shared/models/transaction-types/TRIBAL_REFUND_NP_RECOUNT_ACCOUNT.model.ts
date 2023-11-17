import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NATIONAL_PARTY_TRIBAL_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { ORGANIZATION_B_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';

export class TRIBAL_REFUND_NP_RECOUNT_ACCOUNT extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT);
  schema = schema;
  override isRefund = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction(properties = {}) {
    return SchBTransaction.fromJSON({
      ...{
        form_type: 'SB29',
        transaction_type_identifier: ScheduleBTransactionTypes.TRIBAL_REFUND_NP_RECOUNT_ACCOUNT,
        aggregation_group: AggregationGroups.NATIONAL_PARTY_RECOUNT_ACCOUNT,
      },
      ...properties,
    });
  }
  override generatePurposeDescription(): string {
    return 'Recount/Legal Proceedings Account: Refund';
  }
}
