import { PageUtils } from "../../pages/pageUtils";

export class Loans {
  static FromBank() {
    PageUtils.clickLink('Loan Received from Bank');
  }

  static ByCommittee() {
    PageUtils.clickLink('Loan By Committee');
  }
}