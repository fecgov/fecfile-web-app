import { LabelUtils } from 'app/shared/utils/label.utils';
import { ORGANIZATION, ORGANIZATION_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/DISBURSEMENT_PARENTS';
import { SchBTransactionType } from '../transaction/schedule-b/schb-transaction-type.model';
import { SchBTransaction } from '../transaction/schedule-b/schb-transaction.model';
import {
  STANDARD_PARENT_CONTROLS,
  TransactionNavigationControls,
} from '../transaction/transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleBTransactionTypeLabels,
  ScheduleBTransactionTypes,
} from '../transaction/schedule-b/schedule-b-transaction-types.model';

export class OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL extends SchBTransactionType {
  formFields = ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
  );
  override subTransactionConfig = [ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL_MEMO];
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_PARENT_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.OTHER_DISBURSEMENT_PAYMENT_TO_PAYROLL,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }

  override generatePurposeDescription(transaction: SchBTransaction): string {
    if (transaction.children && transaction.children.some((child) => child.itemized === true)) {
      return 'Payroll Memo: See Below';
    }
    return 'Payroll memo entries do not meet itemization threshold.';
  }
}
