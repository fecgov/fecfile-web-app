import { schema } from 'fecfile-validate/fecfile_validate_js/dist/IN_KIND_OUT';
import { TransactionGroupAA } from '../transaction-groups/transaction-group-aa.model';
import { AggregationGroups } from '../transaction.model';
import { SchBTransaction, ScheduleBTransactionTypes } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';

export class IN_KIND_OUT extends SchBTransactionType {
  transactionGroup = new TransactionGroupAA();
  override isDependentChild = true;
  title = '';
  schema = schema;
  override useParentContact = true;
  override inherittedFields = [
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
