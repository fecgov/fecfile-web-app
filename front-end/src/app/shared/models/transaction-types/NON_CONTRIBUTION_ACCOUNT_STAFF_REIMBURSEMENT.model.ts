import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_A_FOR_B, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';

export class NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT extends SchBTransactionType {
  formFieldsConfig = GROUP_A_FOR_B;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT
  );
  schema = schema;
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
