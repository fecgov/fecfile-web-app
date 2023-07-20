import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_MEMOS';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import { GROUP_B, ORGANIZATION_INDIVIDUAL_COMMITTEE } from 'app/shared/utils/transaction-type-properties';

export class NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO extends SchBTransactionType {
  formFieldsConfig = GROUP_B;
  override contactTypeOptions = ORGANIZATION_INDIVIDUAL_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_STAFF_REIMBURSEMENT_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
