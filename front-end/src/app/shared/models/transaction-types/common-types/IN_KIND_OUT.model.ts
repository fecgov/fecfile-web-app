import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { SchBTransactionType } from '../../schb-transaction-type.model';

export abstract class IN_KIND_OUT extends SchBTransactionType {
  override formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override isDependentChild = true;
  override showAggregate = false;
  override useParentContact = true;

  override description = 'To update any errors found, return to the previous step to update the in-kind receipt.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText = 'Review disbursement information';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Contact';
  override contactLookupLabel = 'CONTACT LOOKUP';
}
