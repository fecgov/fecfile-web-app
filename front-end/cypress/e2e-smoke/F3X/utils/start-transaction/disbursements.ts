import { PageUtils } from '../../../pages/pageUtils';
import { StartTransactionMenu } from './menu';

export class Disbursements {
  static Contributions() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.contributionsToRegisteredFilers);
    return Contributions;
  }

  static Federal() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.federalElectionActivityExpenditures);
    return Federal;
  }

  static Other() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.otherExpenditures);
    return Other;
  }
}

export class Contributions {
  static readonly TO_CANDIDATE = StartTransactionMenu.links.contributionToCandidate;
  static readonly INDEPENDENT_EXPENDITURE = StartTransactionMenu.links.independentExpenditure;

  static ToCandidate() {
    PageUtils.clickLink(Contributions.TO_CANDIDATE);
  }

  static CoordinatedPartyExpenditure() {
    PageUtils.clickLink(StartTransactionMenu.links.coordinatedPartyExpenditure);
  }

  static IndependentExpenditureVoid() {
    PageUtils.clickLink(StartTransactionMenu.links.independentExpenditureVoid);
  }

  static IndependentExpenditure() {
    PageUtils.clickLink(Contributions.INDEPENDENT_EXPENDITURE);
  }
}

class Federal {
  static HundredPercentFederalElectionActivityPayment() {
    PageUtils.clickLink(StartTransactionMenu.links.hundredPercentFederalElectionActivityPayment);
  }

  static CreditCardPayment() {
    PageUtils.clickLink(StartTransactionMenu.links.creditCardPaymentForHundredPercentFederalElectionActivity);
  }
}

class Other {
  static Other() {
    PageUtils.clickLink(StartTransactionMenu.links.otherDisbursement);
  }
}
