import { COMMITTEE_INDIVIDUAL, INDIVIDUAL_COMMITTEE_FORM_FIELDS } from 'app/shared/utils/transaction-type-properties';
import { TemplateMapKeyType } from '../../transaction-type.model';
import { SchAMemo } from './scha_memo.model';

export abstract class EARMARK_MEMO extends SchAMemo {
  formFields = INDIVIDUAL_COMMITTEE_FORM_FIELDS;
  contactTypeOptions = COMMITTEE_INDIVIDUAL;

  override inheritedFields = ['amount' as TemplateMapKeyType];
  override isDependentChild = () => true;

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
