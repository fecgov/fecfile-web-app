import { PageUtils } from '../../pages/pageUtils';

export class Disbursements {
  static Contributions() {
    PageUtils.clickLink('CONTRIBUTIONS/EXPENDITURES TO REGISTERED FILERS');
    return Contributions;
  }

  static Federal() {
    PageUtils.clickLink('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    return Federal;
  }

  static Independent() {
    PageUtils.clickLink('INDEPENDENT EXPENDITURES');
    return Independent;
  }

  static Other() {
    PageUtils.clickLink('OTHER EXPENDITURES');
    return Other;
  }
}

export class Contributions {
  static readonly TO_CANDIDATE = 'Contribution to Candidate';

  static ToCandidate() {
    PageUtils.clickLink('Contribution to Candidate');
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

export class Independent {
  static readonly INDEPENDENT_EXPENDITURE = 'Independent Expenditure';

  static IndependentExpenditureVoid() {
    PageUtils.clickLink('Independent Expenditure - Void');
  }

  static IndependentExpenditure() {
    PageUtils.clickLink(Independent.INDEPENDENT_EXPENDITURE);
  }
}

export class Other {
  static Other() {
    PageUtils.clickLink('Other Disbursement');
  }
}
