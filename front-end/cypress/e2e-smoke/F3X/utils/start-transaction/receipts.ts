import { buildDataCy } from '../../../../utils/dataCy';

const clickReceiptSection = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'receipt', 'picker', label, 'section')).click({ force: true });

const clickReceiptLink = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'receipt', 'picker', label, 'link')).click({ force: true });

export class Receipts {
  static Individual() {
    clickReceiptSection('CONTRIBUTIONS FROM INDIVIDUALS/PERSONS');
    return Individual;
  }

  static RegisteredFilers() {
    clickReceiptSection('CONTRIBUTIONS FROM REGISTERED FILERS');
    return RegisteredFilers;
  }

  static Refunds() {
    clickReceiptSection('REFUNDS');
    return Refunds;
  }

  static Transfers() {
    clickReceiptSection('TRANSFERS');
    return Transfers;
  }

  static Other() {
    clickReceiptSection('OTHER');
    return Other;
  }
}

export class Individual {
  static readonly INDIVIDUAL_RECEIPT = 'Individual Receipt';

  static IndividualReceipt() {
    clickReceiptLink(Individual.INDIVIDUAL_RECEIPT);
  }

  static Returned() {
    clickReceiptLink('Returned/Bounced Receipt');
  }

  static Partnership() {
    clickReceiptLink('Partnership Receipt');
  }

  static Earmark() {
    clickReceiptLink('Earmark Receipt');
  }
}

class RegisteredFilers {
  static Party() {
    clickReceiptLink('Party Receipt');
  }

  static PAC_Earmark() {
    clickReceiptLink('PAC Earmark Receipt');
  }

  static PAC() {
    clickReceiptLink('PAC Receipt');
  }
}

class Refunds {
  static ContributionToOtherPoliticalCommittee() {
    clickReceiptLink('Refund of Contribution to Other Political Committee');
  }
}

class Transfers {
  static JointFundraising() {
    clickReceiptLink('Joint Fundraising Transfer');
  }
}

class Other {
  static OffsetsToOperatingExpenditures() {
    clickReceiptLink('Offsets to Operating Expenditures');
  }
  static OtherReceipts() {
    clickReceiptLink('Other Receipts');
  }
  static IndividualReceiptNonContributionAccount() {
    clickReceiptLink('Individual Receipt - Non-contribution Account');
  }
  static OtherCommitteeReceiptNonContributionAccount() {
    clickReceiptLink('Other Committee Receipt - Non-contribution Account');
  }
  static BusinessLaborOrganizationReceiptNonContributionAccount() {
    clickReceiptLink('Business/Labor Organization Receipt - Non-contribution Account');
  }
}
