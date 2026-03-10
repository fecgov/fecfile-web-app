import { buildDataCy } from '../../../../utils/dataCy';

const clickLoanLink = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'loans-and-debts', 'picker', label, 'link')).click({ force: true });

export class Loans {
  static FromBank() {
    clickLoanLink('Loan Received from Bank');
  }

  static ByCommittee() {
    clickLoanLink('Loan By Committee');
  }

  static Individual() {
    clickLoanLink('Loan Received from Individual');
  }
}
