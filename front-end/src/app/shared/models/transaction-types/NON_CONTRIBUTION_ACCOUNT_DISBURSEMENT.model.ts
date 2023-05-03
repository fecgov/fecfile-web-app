import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT extends SchBTransactionType {
  componentGroupId = 'B';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.COMMITTEE;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override purposeDescriptionPrefix = 'Non-contribution Account: ';

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_DISBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
