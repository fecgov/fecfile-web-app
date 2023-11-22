import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOAN_MADE';
import { SchBTransaction, ScheduleBTransactionTypes, ScheduleBTransactionTypeLabels } from '../schb-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchBTransactionType } from '../schb-transaction-type.model';
import { LabelUtils } from 'app/shared/utils/label.utils';
import { COMMITTEE, COMMON_FIELDS, ADDRESS_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class LOAN_MADE extends SchBTransactionType {
  override formFields = [...COMMON_FIELDS, ...ADDRESS_FIELDS, 'organization_name', 'committee_fec_id'];
  contactTypeOptions = COMMITTEE;
  override isDependentChild = () => true;
  title = LabelUtils.get(ScheduleBTransactionTypeLabels, ScheduleBTransactionTypes.LOAN_MADE);
  schema = schema;
  override useParentContact = true;
  override doMemoCodeDateCheck = false;
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

  override description =
    'Only the Purpose of Disbursement and Note/Memo Text are editable. To update any errors found, return to <b>ENTER DATA</b> to update loan information.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText =
    'Review information and enter purpose of disbursement or note/memo text for the loan made';
  override contactTitle = 'Lendee';

  getNewTransaction() {
    return SchBTransaction.fromJSON({
      form_type: 'SB27',
      transaction_type_identifier: ScheduleBTransactionTypes.LOAN_MADE,
    });
  }
}
