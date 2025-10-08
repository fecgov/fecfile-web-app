import { COMMITTEE, COMMITTEE_B_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { SCHEDULE_B_MEMO } from './SCHEDULE_B_MEMO.model';

export abstract class IN_KIND_OUT extends SCHEDULE_B_MEMO {
  override formFields = COMMITTEE_B_FORM_FIELDS;
  contactTypeOptions = COMMITTEE;
  override isDependentChild = () => true;
  override useParentContact = true;

  override description = 'To update any errors found, return to the previous step to update the in-kind receipt.';
  override accordionTitle = 'AUTO-POPULATED';
  override accordionSubText = 'Review disbursement information';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Contact';
}
