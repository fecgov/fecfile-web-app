import { LabelUtils } from 'app/shared/utils/label.utils';
import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_RECEIPTS';
import { ABSTRACT_IN_KIND } from './ABSTRACT_IN_KIND.model';
import {
  ScheduleATransactionTypeLabels,
  ScheduleATransactionTypes,
  ScheduleBTransactionTypes,
  AggregationGroups,
} from '../type-enums';

export class PAC_IN_KIND_RECEIPT extends ABSTRACT_IN_KIND {
  title = LabelUtils.get(ScheduleATransactionTypeLabels, ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT);
  schema = schema;
  override dependentChildTransactionTypes = [ScheduleBTransactionTypes.PAC_IN_KIND_OUT];

  override readonly initializationData = {
    form_type: 'SA11C',
    transaction_type_identifier: ScheduleATransactionTypes.PAC_IN_KIND_RECEIPT,
    aggregation_group: AggregationGroups.GENERAL,
  };
}
