import { PageUtils } from '../../pages/pageUtils';

export class Debts {
  static ByCommittee() {
    PageUtils.clickLink('Debt Owed By Committee');
  }

  static ToCommittee() {
    PageUtils.clickLink('Debt Owed To Committee');
  }
}
