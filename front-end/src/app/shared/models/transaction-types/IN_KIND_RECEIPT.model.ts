import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_RECEIPT';
import { ABSTRACT_IN_KIND } from './ABSTRACT_IN_KIND.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../transaction-navigation-controls.model';
import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
  AggregationGroups,
} from '../type-enums';

export class IN_KIND_RECEIPT extends ABSTRACT_IN_KIND {
  override formFields = INDIVIDUAL_FORM_FIELDS;
  override contactTypeOptions = INDIVIDUAL;
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.IN_KIND_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.IN_KIND_OUT];
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;

  override readonly initializationData = {
    form_type: 'SA11AI',
    transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_RECEIPT,
    aggregation_group: AggregationGroups.GENERAL,
  };

  override get isReattributable() {
    return false;
  }
}
