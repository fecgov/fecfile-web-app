import { schema } from 'fecfile-validate/fecfile_validate_js/dist/LOANS_RECEIVED';
import { AggregationGroups } from '../transaction.model';
import { SchATransaction, ScheduleATransactionTypes } from '../scha-transaction.model';
import { TemplateMapKeyType } from '../transaction-type.model';
import { SchATransactionType } from '../scha-transaction-type.model';
import {
  INDIVIDUAL_ORGANIZATION_FORM_FIELDS,
  INDIVIDUAL_ORGANIZATION_COMMITTEE,
} from 'app/shared/utils/transaction-type-properties';

export class LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT extends SchATransactionType {
  override formFields = INDIVIDUAL_ORGANIZATION_FORM_FIELDS;
  override contactTypeOptions = INDIVIDUAL_ORGANIZATION_COMMITTEE;
  override isDependentChild = true;
  override doMemoCodeDateCheck = false;
  title = 'Receipt';
  schema = schema;
  override useParentContact = true;
  override inheritedFields = [
    'entity_type',
    'organization_name',
    'first_name',
    'last_name',
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
    'memo_code',
  ] as TemplateMapKeyType[];

  override description =
    'Only the Purpose of Receipt and Note/Memo Text are editable. To update any errors found, return to the previous step to update loan information.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText = 'Review information and enter purpose of description or note/memo text';
  override formTitle = 'Receipt';
  override footer = undefined;
  override contactTitle = 'Contact';
  override contactLookupLabel = 'CONTACT LOOKUP';

  getNewTransaction() {
    return SchATransaction.fromJSON({
      form_type: 'SA13',
      transaction_type_identifier: ScheduleATransactionTypes.LOAN_RECEIVED_FROM_INDIVIDUAL_RECEIPT,
      aggregation_group: AggregationGroups.GENERAL,
    });
  }
}
