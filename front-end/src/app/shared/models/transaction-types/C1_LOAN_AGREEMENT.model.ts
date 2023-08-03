import { schema } from 'fecfile-validate/fecfile_validate_js/dist/C1_LOAN_AGREEMENT';
import { SchC1Transaction, ScheduleC1TransactionTypes } from '../schc1-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchC1TransactionType } from '../schc1-transaction-type.model';
import {
  ORGANIZATION_FORM_FIELDS,
  ORGANIZATION,
  ORG_FIELDS,
  CORE_FIELDS,
} from 'app/shared/utils/transaction-type-properties';

export class C1_LOAN_AGREEMENT extends SchC1TransactionType {
  override formFields = ORGANIZATION_FORM_FIELDS;
  override contactTypeOptions = ORGANIZATION;
  override isDependentChild = true;
  override doMemoCodeDateCheck = false;
  title = 'Loan agreement';
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [...CORE_FIELDS, ...ORG_FIELDS] as TemplateMapKeyType[];

  override description =
    'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText = 'Review information and enter purpose of description or note/memo text';
  override formTitle = 'Receipt';
  override footer = undefined;
  override contactTitle = 'Contact';
  override contactLookupLabel = 'CONTACT LOOKUP';

  getNewTransaction() {
    return SchC1Transaction.fromJSON({
      form_type: 'SC1/10',
      transaction_type_identifier: ScheduleC1TransactionTypes.C1_LOAN_AGREEMENT,
    });
  }
}
