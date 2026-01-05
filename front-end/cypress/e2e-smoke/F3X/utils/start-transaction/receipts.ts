import { PageUtils } from '../../../pages/pageUtils';

export class Receipts {
  static Individual() {
    PageUtils.clickAccordion('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    return Individual;
  }

  static RegisteredFilers() {
    PageUtils.clickAccordion('CONTRIBUTIONS FROM REGISTERED FILERS');
    return RegisteredFilers;
  }

  static Refunds() {
    PageUtils.clickAccordion('REFUNDS');
    return Refunds;
  }

  static Transfers() {
    PageUtils.clickAccordion('TRANSFERS');
    return Transfers;
  }

  static Other() {
    PageUtils.clickAccordion("OTHER");
    return Other;
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

class RegisteredFilers {
  static Party() {
    PageUtils.clickLink('Party Receipt');
  }

  static PAC_Earmark() {
    PageUtils.clickLink('PAC Earmark Receipt');
  }

  static PAC() {
    PageUtils.clickLink('PAC Receipt');
  }
}

class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    PageUtils.clickLink('Refund of Contribution to Other Political Committee');
  }
}

class Transfers {
  static JointFundraising() {
    PageUtils.clickLink('Joint Fundraising Transfer');
  }
}

class Other {
  static OffsetsToOperatingExpenditures() {
    PageUtils.clickLink("Offsets to Operating Expenditures");
  }
  static OtherReceipts() {
    PageUtils.clickLink("Other Receipts")
  }
  static IndividualReceiptNonContributionAccount() {
    PageUtils.clickLink("Individual Receipt - Non-contribution Account");
  }
  static OtherCommitteeReceiptNonContributionAccount() {
    PageUtils.clickLink("Other Committee Receipt - Non-contribution Account");
  }
  static BusinessLaborOrganizationReceiptNonContributionAccount() {
    PageUtils.clickLink("Business/Labor Organization Receipt - Non-contribution Account");
  }
}
