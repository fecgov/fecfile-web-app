import { SchATransactionType } from '../../scha-transaction-type.model';
import {
  STANDARD_DOUBLE_ENTRY_CONTROLS,
  TransactionNavigationControls,
} from '../../transaction-navigation-controls.model';
import { TemplateMapKeyType } from '../../transaction-type.model';

export abstract class CONDUIT_EARMARK extends SchATransactionType {
  override navigationControls: TransactionNavigationControls = STANDARD_DOUBLE_ENTRY_CONTROLS;
  override childTriggerFields = ['organization_name', 'last_name', 'first_name'] as TemplateMapKeyType[];
  override showAggregate = false;
  override apiEndpoint = '/transactions/save-pair';
  override memoCodeMap = {
    true: 'Undeposited',
    false: 'Deposited',
  };

  override description =
    'This receipt type requires an associated transaction. Follow this two-step process to create both a conduit earmark receipt and a conduit earmark out:';
  override accordionTitle = 'STEP ONE';
  override accordionSubText = 'Add contact and receipt information';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Contact';
  override contactLookupLabel = 'CONTACT LOOKUP';
}
