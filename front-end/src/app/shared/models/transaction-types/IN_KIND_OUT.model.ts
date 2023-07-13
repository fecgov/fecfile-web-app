import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_OUT';
import { TransactionGroupAA } from '../transaction-groups/transaction-group-aa.model';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { GROUP_A, GROUP_A_FOR_B } from 'app/shared/utils/transaction-type-properties';
import { IN_KIND_OUT as LABEL_CONFIG } from 'app/shared/utils/transaction-type-labels.utils';

export class IN_KIND_OUT extends SchBTransactionType {
  transactionGroup = new TransactionGroupAA();
  formProperties = GROUP_A_FOR_B;
  override labelConfig = LABEL_CONFIG;
  override isDependentChild = true;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.IN_KIND_OUT);
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [
    'last_name',
    'first_name',
    'middle_name',
    'prefix',
    'suffix',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'purpose_description',
    'memo_code',
  ] as TemplateMapKeyType[];

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB21B',
      transaction_type_identifier: ScheduleBTransactionTypes.IN_KIND_OUT,
      aggregation_group: AggregationGroups.GENERAL_DISBURSEMENT,
    });
  }
}
