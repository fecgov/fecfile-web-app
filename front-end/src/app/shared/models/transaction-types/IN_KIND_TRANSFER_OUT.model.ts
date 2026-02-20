import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_OUTS';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { ABSTRACT_IN_KIND_OUT } from './ABSTRACT_IN_KIND_OUT.model';
import { AggregationGroups, ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes } from '../type-enums';

export class IN_KIND_TRANSFER_OUT extends ABSTRACT_IN_KIND_OUT {
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT);
  schema = schema;
  override inheritedFields = [
    'organization_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'purpose_description',
    'committee_fec_id',
    'committee_name',
    'memo_code',
  ] as TemplateMapKeyType[];

  override readonly initializationData = {
    form_type: 'SB21B',
    transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT,
    aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
  };
}
