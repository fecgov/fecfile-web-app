import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS_STAFF';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT extends SchBTransactionType {
  componentGroupId = 'A';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT
  );
  schema = schema;
  override defaultContactTypeOption = ContactTypes.INDIVIDUAL;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;
  override subTransactionConfig = [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT_MEMO];

  override generatePurposeDescription() {
    return 'Reimbursement: See Below';
  }

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_STAFF_REIMBURSEMENT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
