import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_OUTS';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { GROUP_EFI_FOR_B } from 'app/shared/utils/transaction-type-properties';
import { IN_KIND_OUT } from 'app/shared/utils/transaction-type-labels.utils';

export class IN_KIND_TRANSFER_FEA_OUT extends SchBTransactionType {
  override labelConfig = IN_KIND_OUT;
  formProperties = GROUP_EFI_FOR_B;
  override isDependentChild = true;
  override showAggregate = false;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_TRANSFER_FEA_OUT);
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
      form_type: 'SB30B',
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_TRANSFER_FEA_OUT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
