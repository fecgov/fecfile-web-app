import { schema } from 'fecfile-validate/fecfile_validate_js/dist/COM_IN_KIND_OUTS';
import { TransactionGroupEE } from '../transaction-groups/transaction-group-ee.model';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';

export class IN_KIND_TRANSFER_OUT extends SchBTransactionType {
  transactionGroup = new TransactionGroupEE();
  override isDependentChild = true;
  override showAggregate = false;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT);
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
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_TRANSFER_OUT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
