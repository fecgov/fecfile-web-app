import { PageUtils } from '../../../pages/pageUtils';
import { StartTransactionMenu } from './menu';

export class Loans {
  static FromBank() {
    PageUtils.clickLink(StartTransactionMenu.links.loanReceivedFromBank);
  }

  static ByCommittee() {
    PageUtils.clickLink(StartTransactionMenu.links.loanByCommittee);
  }

  static Individual() {
    PageUtils.clickLink(StartTransactionMenu.links.loanReceivedFromIndividual);
  }
}
