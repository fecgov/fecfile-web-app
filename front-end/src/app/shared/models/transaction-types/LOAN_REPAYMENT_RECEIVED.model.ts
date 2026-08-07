import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_REPAYMENT_RECEIVED';
import { SchATransactionType } from '../transaction/schedule-a/scha-transaction-type.model';
import { SchATransaction } from '../transaction/schedule-a/scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction/transaction-navigation-controls.model';
import {
  ADDRESS_FIELDS,
  COM_FIELDS,
  COMMITTEE,
  ORGANIZATION_FORM_FIELDS,
} from 'app/shared/utils/transaction-type-properties';
import { TemplateMapKeyType } from '../transaction/transaction-type.model';
import { AggregationGroups } from '../transaction/agregation-groups.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
} from '../transaction/schedule-a/schedule-a-transaction-types.model';

export class LOAN_REPAYMENT_RECEIVED extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;
  override inheritedFields = [...COM_FIELDS, ...ADDRESS_FIELDS] as TemplateMapKeyType[];

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA14',
      transaction_type_identifier: ScheduleATransactionTypes.LOAN_REPAYMENT_RECEIVED,
      aggregation_group: AggregationGroups.LINE_14,
    });
  }

  override generatePurposeDescription(): string {
    return 'Loan Repayment';
  }
}
