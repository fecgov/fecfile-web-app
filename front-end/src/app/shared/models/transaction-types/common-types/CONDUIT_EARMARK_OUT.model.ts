import { TemplateMapKeyType } from '../../transaction-type.model';
import { SchBTransactionType } from '../../schb-transaction-type.model';

export abstract class CONDUIT_EARMARK_OUT extends SchBTransactionType {
  override isDependentChild = () => true;
  override inheritedFields = ['amount', 'memo_code'] as TemplateMapKeyType[];
  override hasCandidateCommittee = true;
  override candidateInfoPosition = 'high';
  override contact2IsRequired = () => true;

  override description = undefined;
  override accordionTitle = 'STEP TWO';
  override accordionSubText = 'Add earmarked memo and conduit information (REQUIRED FOR CONDUIT EARMARKED RECEIPTS)';
  override formTitle = undefined;
  override footer = undefined;
  override contactTitle = 'Contact';
}
