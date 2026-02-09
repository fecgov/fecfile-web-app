import { PageUtils } from '../../../pages/pageUtils';
import { StartTransactionMenu } from './menu';

export class Debts {
  static ByCommittee() {
    PageUtils.clickLink(StartTransactionMenu.links.debtOwedByCommittee);
  }

  static ToCommittee() {
    PageUtils.clickLink(StartTransactionMenu.links.debtOwedToCommittee);
  }
}
