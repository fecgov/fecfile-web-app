import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { TransactionNavigationControls, STANDARD_PARENT_CONTROLS } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT extends SchBTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.INDIVIDUAL;
  override subTransactionConfig = [ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO];
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
  override generatePurposeDescription(): string {
    return 'Non-contribution Account - Reimbursement: See Below';
  }
}
