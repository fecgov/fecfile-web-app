import { COMMITTEE_INDIVIDUAL, GROUP_G } from 'app/shared/utils/transaction-type-properties';
import { SchATransactionType } from '../../scha-transaction-type.model';
import { TemplateMapKeyType } from '../../transaction-type.model';

export abstract class EARMARK_MEMO extends SchATransactionType {
  formFieldsConfig = GROUP_G;
  contactTypeOptions = COMMITTEE_INDIVIDUAL;

  override inheritedFields = ['amount' as TemplateMapKeyType];
  override isDependentChild = true;

  override description = undefined;
  override accordionTitle = 'STEP TWO';
  override accordionSubText = 'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Conduit';
  override contactLookupLabel = 'CONTACT LOOKUP';
  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }
}
