import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_MEMOS';
import { ContactTypes } from '../contact.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TransactionGroupC } from '../transaction-groups/transaction-group-c.model';
import { getChildNavigationControls, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  CATEGORY_CODE,
  CORE_FIELDS,
  EMPLOYEE_INFO_FIELDS,
  GROUP_C,
  GROUP_C_FOR_B,
  INDIVIDUAL_FIELDS,
  INDIVIDUAL_ORGANIZATION,
  ORG_FIELDS,
  TransactionTypeFormProperties,
} from 'app/shared/utils/transaction-type-properties';

export class NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO extends SchBTransactionType {
  transactionGroup = new TransactionGroupC();
  formProperties = GROUP_C_FOR_B;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO
  );
  schema = schema;
  override navigationControls: TransactionNavigationControls = getChildNavigationControls();

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
