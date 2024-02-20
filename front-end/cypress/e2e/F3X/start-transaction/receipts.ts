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
}

export class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
  }
}
