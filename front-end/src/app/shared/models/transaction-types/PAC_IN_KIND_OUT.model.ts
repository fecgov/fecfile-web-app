import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_OUTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { IN_KIND_OUT } from './common-types/IN_KIND_OUT.model';

export class PAC_IN_KIND_OUT extends IN_KIND_OUT {
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.PAC_IN_KIND_OUT);
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

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.PAC_IN_KIND_OUT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
