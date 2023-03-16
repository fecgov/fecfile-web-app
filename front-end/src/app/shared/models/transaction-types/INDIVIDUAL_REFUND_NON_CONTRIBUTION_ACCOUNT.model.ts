import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_REFUNDS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT extends SchBTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.INDIVIDUAL_REFUND_NON_CONTRIBUTION_ACCOUNT
  );
  schema = schema;
  override showAggregate = false;
  override defaultContactTypeOption = ContactTypes.INDIVIDUAL;
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
