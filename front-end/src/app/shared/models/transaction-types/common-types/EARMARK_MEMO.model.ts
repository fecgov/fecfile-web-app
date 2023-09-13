import { COMMITTEE_INDIVIDUAL, INDIVIDUAL_COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { SchATransactionType } from '../../scha-transaction-type.model';
import { TemplateMapKeyType } from '../../transaction-type.model';

export abstract class EARMARK_MEMO extends SchATransactionType {
  formFields = INDIVIDUAL_COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE_INDIVIDUAL;

  override inheritedFields = ['amount' as TemplateMapKeyType];
  override isDependentChild = true;

  override description = undefined;
  override accordionTitle = 'STEP TWO';
  override accordionSubText = 'Add earmarked memo and conduit information (REQUIRED FOR EARMARKED RECEIPTS)';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Conduit';
  override generatePurposeDescription(): string {
    return 'Total earmarked through conduit.';
  }
}
