import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_MADE';
import { TransactionGroupYB } from '../transaction-groups/transaction-group-yb.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';

export class LOAN_MADE extends SchBTransactionType {
  transactionGroup = new TransactionGroupYB();
  override isDependentChild = true;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.LOAN_MADE);
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [
    'entity_type',
    'organization_name',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
  ] as TemplateMapKeyType[];

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB27',
      transaction_type_identifier: ScheduleBTransactionTypes.LOAN_MADE,
    });
  }

  /////////////////////////////////////////////////////////////////////
  // Template variables to be integrated with #1193
  override doMemoCodeDateCheck = false;
}
