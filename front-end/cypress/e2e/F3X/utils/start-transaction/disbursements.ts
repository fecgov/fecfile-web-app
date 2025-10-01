import { PageUtils } from '../../../pages/pageUtils';

export class Disbursements {
  static Contributions() {
    PageUtils.clickAccordion('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
    return Contributions;
  }

  static Federal() {
    PageUtils.clickAccordion('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    return Federal;
  }

  static Other() {
    PageUtils.clickAccordion('OTHER EXPENDITURES');
    return Other;
  }
}

export class Contributions {
  static readonly TO_CANDIDATE = 'Contribution to Candidate';
  static readonly INDEPENDENT_EXPENDITURE = 'Independent Expenditure';

  static ToCandidate() {
    PageUtils.clickLink(Contributions.TO_CANDIDATE);
  }

  static CoordinatedPartyExpenditure() {
    PageUtils.clickLink('Coordinated Party Expenditure');
  }

  static IndependentExpenditureVoid() {
    PageUtils.clickLink(`${Contributions.INDEPENDENT_EXPENDITURE} - Void`);
  }

  static IndependentExpenditure() {
    PageUtils.clickLink(Contributions.INDEPENDENT_EXPENDITURE);
  }
}

export class Federal {
  static HundredPercentFederalElectionActivityPayment() {
    PageUtils.clickLink('100% Federal Election Activity Payment');
  }

  static CreditCardPayment() {
    PageUtils.clickLink('Credit Card Payment for 100% Federal Election Activity');
  }
}

export class Other {
  static Other() {
    PageUtils.clickLink('Other Disbursement');
  }
}
