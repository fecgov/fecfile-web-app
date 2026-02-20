import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/PARTNERSHIP_ATTRIBUTION';
import { CHILD_CONTROLS } from '../transaction-navigation-controls.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { ScheduleATransactionTypeLabels, ScheduleATransactionTypes, AggregationGroups } from '../type-enums';

export class PARTNERSHIP_ATTRIBUTION extends SchATransactionType {
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION);
  schema = schema;
  override navigationControls = CHILD_CONTROLS;

  override generatePurposeDescription(): string {
    return 'Partnership Attribution';
  }

  override readonly initializationData = {
    form_type: 'SA11AI',
    transaction_type_identifier: ScheduleATransactionTypes.PARTNERSHIP_ATTRIBUTION,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
