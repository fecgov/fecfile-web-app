import { buildDataCy } from '../../../../utils/dataCy';

const clickDebtLink = (label: string) =>
  cy.getByDataCy(buildDataCy('transactions', 'loans-and-debts', 'picker', label, 'link')).click({ force: true });

export class Debts {
  static ByCommittee() {
    clickDebtLink('Debt Owed By Committee');
  }

  static ToCommittee() {
    clickDebtLink('Debt Owed To Committee');
  }
}
