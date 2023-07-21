import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_MADE';
import { TransactionGroupYB } from '../transaction-groups/transaction-group-yb.model';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';

export class LOAN_MADE extends SchBTransactionType {
  override formFields = INDIVIDUAL_B_FORM_FIELDS;
  override isDependentChild = true;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.LOAN_MADE);
  schema = schema;
  override useParentContact = true;
  override showAggregate = false;
  override inheritedFields = [
    'entity_type',
    'organization_name',
    'committee_fec_id',
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'memo_code',
  ] as TemplateMapKeyType[];

  constructor() {
    super();
    // No category code info collected for this transaction type.
    // Hide the field in the additional-info component by removing
    // its value in the templateMap.
    this.templateMap['category_code'] = '';
  }

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
