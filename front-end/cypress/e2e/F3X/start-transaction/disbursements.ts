import { PageUtils } from "../../pages/pageUtils";

export class Disbursements {

  // FEDERAL ELECTION ACTIVITY EXPENDITURES
  static Federal() {
    PageUtils.clickLink('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    return Federal;
  }

  static IndependentExpenditure() {
    PageUtils.clickLink('INDEPENDENT EXPENDITURES');
    return Independent;
  }

  static Other() {
    PageUtils.clickLink('OTHER EXPENDITURES');
    return Other;
  }
}

export class Federal {
  static HundredPercentFederalElectionActivityPayment() {
    PageUtils.clickLink('100% Federal Election Activity Payment');
  }
}

export class Independent {
  static IndependentExpenditureVoid() {
    PageUtils.clickLink('Independent Expenditure - Void');
  }
}

export class Other {
  static Other() {
    PageUtils.clickLink('Other Disbursement');
  }
}