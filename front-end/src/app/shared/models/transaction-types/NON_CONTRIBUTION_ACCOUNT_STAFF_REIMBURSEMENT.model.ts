import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { INDIVIDUAL_B_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT extends SchBTransactionType {
  formFields = INDIVIDUAL_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT,
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
  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Reimbursement Memo: See Below';
    }
    return 'Reimbursement memo entries do not meet itemization threshold.';
  }
}
