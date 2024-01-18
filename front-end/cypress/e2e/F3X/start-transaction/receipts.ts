import { PageUtils } from "../../pages/pageUtils";

export class Receipts {

  static Individual() {
    PageUtils.clickLink('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    return Individual;
  }

  static RegisteredFilers() {
    PageUtils.clickLink('CONTRIBUTIONS FROM REGISTERED FILERS');
    return RegisteredFilers;
  }

  static Refunds() {
    PageUtils.clickLink('REFUNDS');
    return Refunds;
  }
}

export class Individual {
  static IndividualReceipt() {
    PageUtils.clickLink('Individual Receipt');
  }

  static Returned() {
    PageUtils.clickLink('Returned/Bounced Receipt');
  }

  static Partnership() {
    PageUtils.clickLink('Partnership Receipt');
  }
}

export class RegisteredFilers {
  static Party() {
    PageUtils.clickLink('Party Receipt');
  }
}

export class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
  }
}