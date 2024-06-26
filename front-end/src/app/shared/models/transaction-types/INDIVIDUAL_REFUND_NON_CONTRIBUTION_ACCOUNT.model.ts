import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_REFUNDS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { INDIVIDUAL_B_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';

export class INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT extends SchBTransactionType {
  formFields = INDIVIDUAL_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT,
      aggregation_group: AggregationGroups.NON_CONTRIBUTION_ACCOUNT,
    });
  }
  override generatePurposeDescription(): string {
    return 'Non-contribution Account Refund';
  }
}
