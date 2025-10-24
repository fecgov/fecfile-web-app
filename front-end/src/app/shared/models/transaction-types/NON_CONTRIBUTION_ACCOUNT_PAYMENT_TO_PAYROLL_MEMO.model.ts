import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/NON_CONTRIBUTION_MEMOS';
import { SchBTransaction, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { SCHEDULE_B_MEMO } from './common-types/SCHEDULE_B_MEMO.model';

export class NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO extends SCHEDULE_B_MEMO {
  formFields = INDIVIDUAL_ORGANIZATION_B_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  title = LabelUtils.get(
    ScheduleBTransactionTypeLabels,
    ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO,
  );
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB29',
      transaction_type_identifier: ScheduleBTransactionTypes.NON_CONTRIBUTION_ACCOUNT_PAYMENT_TO_PAYROLL_MEMO,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
