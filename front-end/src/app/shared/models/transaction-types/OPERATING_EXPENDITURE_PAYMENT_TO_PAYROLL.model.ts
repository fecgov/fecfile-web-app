import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { STANDARD_PARENT_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ContactTypes } from '../contact.model';

export class OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL extends SchBTransactionType {
  componentGroupId = 'D';
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL
  );
  override subTransactionConfig = [ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL_MEMO];
  schema = schema;
  override defaultContactTypeOption = ContactTypes.ORGANIZATION;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21b',
      transaction_type_identifier: ScheduleBTransactionTypes.OPERATING_EXPENDITURE_PAYMENT_TO_PAYROLL,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(): string {
    return 'Payroll: See Below';
  }
}
