import { COMMITTEE, COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { SchATransactionType } from '../../scha-transaction-type.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../../transaction-navigation-controls.model';
import { ContactTypes } from '../../contact.model';

export abstract class IN_KIND extends SchATransactionType {
  override _navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  formFields = COMMITTEE_FORM_FIELDS;
  contactTypeOptions: ContactTypes[] = COMMITTEE;

  override description =
    'This receipt type automatically creates an associated transaction. Saving an in-kind receipt will automatically create an in-kind out.'; // Prose describing transaction and filling out the form
  override accordionTitle = 'STEP ONE'; // Title for accordion handle (does not include subtext)
  override accordionSubText = 'Add contact and receipt information'; // Text after title in accordion handle
  override formTitle = undefined; // Title of form within accordion section
  override footer =
    'The information in this receipt will automatically populate a related transaction. Review the associated disbursement or click "Save both transactions" to record these transactions.'; // Text at the end of form
  override contactTitle = 'Contact'; // Title for primary contact

  override purposeDescriptionPrefix = 'In-Kind: ';

  override get isReattributable(): boolean {
    return false;
  }
}
