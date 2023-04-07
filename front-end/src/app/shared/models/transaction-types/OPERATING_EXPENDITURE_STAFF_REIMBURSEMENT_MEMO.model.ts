import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_MEMOS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO extends SchBTransactionType {
  componentGroupId = 'B';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.ORGANIZATION;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
