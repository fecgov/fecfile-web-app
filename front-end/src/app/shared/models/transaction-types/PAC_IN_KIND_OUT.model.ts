import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_OUTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { GROUP_EFI_FOR_B } from 'app/shared/utils/transaction-type-properties';
import { IN_KIND_OUT } from 'app/shared/utils/transaction-type-labels.utils';

export class PAC_IN_KIND_OUT extends SchBTransactionType {
  formProperties = GROUP_EFI_FOR_B;
  override labelConfig = IN_KIND_OUT;
  override isDependentChild = true;
  override showAggregate = false;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.PAC_IN_KIND_OUT);
  schema = schema;
  override useParentContact = true;
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
