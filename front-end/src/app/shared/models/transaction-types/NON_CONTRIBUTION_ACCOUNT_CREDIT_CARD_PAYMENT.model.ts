import { LabelUtils } from 'app/shared/utils/label.utils';
import { ORGANIZATION, ORGANIZATION_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_PARENTS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';

export class NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
  );
  schema = schema;
  override subTransactionConfig = [ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_CREDIT_CARD_PAYMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Credit Card Memo: See Below';
    }
    return 'Credit card memo entries do not meet itemization threshold.';
  }
}
