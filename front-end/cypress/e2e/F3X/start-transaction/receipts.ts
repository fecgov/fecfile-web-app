import { PageUtils } from '../../pages/pageUtils';

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

  static Transfers() {
    PageUtils.clickLink('TRANSFERS');
    return Transfers;
  }
}

export class Individual {
  static readonly INDIVIDUAL_RECEIPT = 'Individual Receipt';

  static IndividualReceipt() {
    PageUtils.clickLink(Individual.INDIVIDUAL_RECEIPT);
  }

  static Returned() {
    PageUtils.clickLink('Returned/Bounced Receipt');
  }

  static Partnership() {
    PageUtils.clickLink('Partnership Receipt');
  }

  static Earmark() {
    PageUtils.clickLink('Earmark Receipt');
  }
}

export class RegisteredFilers {
  static Party() {
    PageUtils.clickLink('Party Receipt');
  }

  static PAC() {
    PageUtils.clickLink('PAC Earmark Receipt');
  }
}

export class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
  }
}

export class Transfers {
  static JointFundraising() {
    PageUtils.clickLink('Joint Fundraising Transfer');
  }
}
