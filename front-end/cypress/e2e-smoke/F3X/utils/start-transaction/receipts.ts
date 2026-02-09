import { PageUtils } from '../../../pages/pageUtils';
import { StartTransactionMenu } from './menu';

export class Receipts {
  static Individual() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.contributionsFromIndividuals);
    return Individual;
  }

  static RegisteredFilers() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.contributionsFromRegisteredFilers);
    return RegisteredFilers;
  }

  static Refunds() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.refunds);
    return Refunds;
  }

  static Transfers() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.transfers);
    return Transfers;
  }

  static Other() {
    PageUtils.clickAccordion(StartTransactionMenu.accordion.other);
    return Other;
  }
}

export class Individual {
  static readonly INDIVIDUAL_RECEIPT = StartTransactionMenu.links.individualReceipt;

  static IndividualReceipt() {
    PageUtils.clickLink(Individual.INDIVIDUAL_RECEIPT);
  }

  static Returned() {
    PageUtils.clickLink(StartTransactionMenu.links.returnedBouncedReceipt);
  }

  static Partnership() {
    PageUtils.clickLink(StartTransactionMenu.links.partnershipReceipt);
  }

  static Earmark() {
    PageUtils.clickLink(StartTransactionMenu.links.earmarkReceipt);
  }
}

class RegisteredFilers {
  static Party() {
    PageUtils.clickLink(StartTransactionMenu.links.partyReceipt);
  }

  static PAC_Earmark() {
    PageUtils.clickLink(StartTransactionMenu.links.pacEarmarkReceipt);
  }

  static PAC() {
    PageUtils.clickLink(StartTransactionMenu.links.pacReceipt);
  }
}

class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    PageUtils.clickLink(StartTransactionMenu.links.refundContributionToOtherPoliticalCommittee);
  }
}

class Transfers {
  static JointFundraising() {
    PageUtils.clickLink(StartTransactionMenu.links.jointFundraisingTransfer);
  }
}

class Other {
  static OffsetsToOperatingExpenditures() {
    PageUtils.clickLink(StartTransactionMenu.links.offsetsToOperatingExpenditures);
  }
  static OtherReceipts() {
    PageUtils.clickLink(StartTransactionMenu.links.otherReceipts);
  }
  static IndividualReceiptNonContributionAccount() {
    PageUtils.clickLink(StartTransactionMenu.links.individualReceiptNonContributionAccount);
  }
  static OtherCommitteeReceiptNonContributionAccount() {
    PageUtils.clickLink(StartTransactionMenu.links.otherCommitteeReceiptNonContributionAccount);
  }
  static BusinessLaborOrganizationReceiptNonContributionAccount() {
    PageUtils.clickLink(StartTransactionMenu.links.businessLaborOrganizationReceiptNonContributionAccount);
  }
}
