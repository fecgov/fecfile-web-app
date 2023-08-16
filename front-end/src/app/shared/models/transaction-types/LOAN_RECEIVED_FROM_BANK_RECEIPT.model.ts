import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS_RECEIVED';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import { ORGANIZATION_FORM_FIELDS, ORGANIZATION, ORG_FIELDS } from 'app/shared/utils/transaction-type-properties';

export class LOAN_RECEIVED_FROM_BANK_RECEIPT extends SchATransactionType {
  override formFields = ORGANIZATION_FORM_FIELDS;
  override contactTypeOptions = ORGANIZATION;
  override isDependentChild = true;
  override doMemoCodeDateCheck = false;
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [
    ...ORG_FIELDS,
    'street_1',
    'street_2',
    'city',
    'state',
    'zip',
    'date',
    'amount',
    'memo_code',
  ] as TemplateMapKeyType[];

  override description =
    'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to <b>ENTER DATA</b> to update loan information.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText = 'Review information and enter purpose of description or note/memo text for this receipt';
  override footer = undefined;
  title = 'Loan Receipt';
  override contactTitle = 'Lender';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA13',
      transaction_type_identifier: ScheduleATransactionTypes.LOAN_RECEIVED_FROM_BANK_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
