import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/RECEIPT_FROM_UNREGISTERED_ENTITY';
import { SchATransactionType } from '../scha-transaction-type.model';
import { STANDARD_CONTROLS, TransactionNavigationControls } from '../transaction-navigation-controls.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION } from 'app/shared/utils/transaction-type-properties';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class RECEIPT_FROM_UNREGISTERED_ENTITY extends SchATransactionType {
  formFields = ORGANIZATION_FORM_FIELDS;
  contactTypeOptions = ORGANIZATION;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY);
  schema = schema;
  override navigationControls: TransactionNavigationControls = STANDARD_CONTROLS;

  override readonly initializationData = {
    form_type: 'SA11AI',
    transaction_type_identifier: ScheduleATransactionTypes.RECEIPT_FROM_UNREGISTERED_ENTITY,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
