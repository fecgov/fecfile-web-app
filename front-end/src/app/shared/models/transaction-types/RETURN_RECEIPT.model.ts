import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RETURN_RECEIPT';
import { SchATransactionType } from '../scha-transaction-type.model';
import { SchATransaction, ScheduleATransactionTypeLabels, ScheduleATransactionTypes } from '../scha-transaction.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { AggregationGroups } from '../transaction.model';
import {
  INDIVIDUAL_ORGANIZATION_WITH_EMPLOYEE_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';
import { ContactType } from '../contact.model';

export class RETURN_RECEIPT extends SchATransactionType {
  formFields = INDIVIDUAL_ORGANIZATION_WITH_EMPLOYEE_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL);
  schema = schema;
  override negativeAmountValueOnly = true;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA11AI',
      transaction_type_identifier: ScheduleATransactionTypes.RETURNED_BOUNCED_RECEIPT_INDIVIDUAL,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
