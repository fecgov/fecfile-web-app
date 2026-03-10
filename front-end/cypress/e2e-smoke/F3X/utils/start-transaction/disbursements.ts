import { buildDataCy } from '../../../../utils/dataCy';

const clickDisbursementSection = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'disbursement', 'picker', label, 'section')).click({ force: true });

const clickDisbursementLink = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'disbursement', 'picker', label, 'link')).click({ force: true });

export class Disbursements {
  static Contributions() {
    clickDisbursementSection('CONTRIBUTIONS/EXPENDITURES TO/ON BEHALF OF REGISTERED FILERS');
    return Contributions;
  }

  static Federal() {
    clickDisbursementSection('FEDERAL ELECTION ACTIVITY EXPENDITURES');
    return Federal;
  }

  static Other() {
    clickDisbursementSection('OTHER EXPENDITURES');
    return Other;
  }
}

export class Contributions {
  static readonly TO_CANDIDATE = 'Contribution to Candidate';
  static readonly INDEPENDENT_EXPENDITURE = 'Independent Expenditure';

  static ToCandidate() {
    clickDisbursementLink(Contributions.TO_CANDIDATE);
  }

  static CoordinatedPartyExpenditure() {
    clickDisbursementLink('Coordinated Party Expenditure');
  }

  static IndependentExpenditureVoid() {
    clickDisbursementLink(`${Contributions.INDEPENDENT_EXPENDITURE} - Void`);
  }

  static IndependentExpenditure() {
    clickDisbursementLink(Contributions.INDEPENDENT_EXPENDITURE);
  }
}

class Federal {
  static HundredPercentFederalElectionActivityPayment() {
    clickDisbursementLink('100% Federal Election Activity Payment');
  }

  static CreditCardPayment() {
    clickDisbursementLink('Credit Card Payment for 100% Federal Election Activity');
  }
}

class Other {
  static Other() {
    clickDisbursementLink('Other Disbursement');
  }
}
