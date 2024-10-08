import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { AggregationGroups } from '../transaction.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';

export class PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO extends SchATransactionType {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(
    ScheduleATransactionTypeLabels,
    ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO,
  );
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Recount Account Partnership Attribution';
  }

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA17',
      transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION_RECOUNT_ACCOUNT_RECEIPT_MEMO,
      aggregation_group: AggregationGroups.RECOUNT_ACCOUNT,
    });
  }
}
