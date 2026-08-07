import { INDIVIDUAL_FORM_FIELDS, INDIVIDUAL } from 'app/shared/utils/transaction-type-properties';
import { SchATransactionType } from '../../transaction/schedule-a/scha-transaction-type.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../../transaction/transaction-navigation-controls.model';
import type { TemplateMapKeyType } from '../../transaction/transaction-type.model';
import type { ContactTypes } from '../../contacts/contact-types.model';

export abstract class EARMARK extends SchATransactionType {
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  formFields = INDIVIDUAL_FORM_FIELDS;
  contactTypeOptions: ContactTypes[] = INDIVIDUAL;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];

  override description =
    'This type of receipt requires a memo transaction. Follow this two-step process to create both an earmark receipt and an earmark memo:';
  override accordionTitle = 'STEP ONE';
  override accordionSubText = 'Add receipt and contributor information';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Contact';
}
