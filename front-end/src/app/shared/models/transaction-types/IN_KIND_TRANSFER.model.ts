import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { ABSTRACT_IN_KIND } from './ABSTRACT_IN_KIND.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
  AggregationGroups,
} from '../type-enums';

export class IN_KIND_TRANSFER extends ABSTRACT_IN_KIND {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.IN_KIND_TRANSFER);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT];

  override readonly initializationData = {
    form_type: 'SA12',
    transaction_type_identifier: ScheduleATransactionTypes.IN_KIND_TRANSFER,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
