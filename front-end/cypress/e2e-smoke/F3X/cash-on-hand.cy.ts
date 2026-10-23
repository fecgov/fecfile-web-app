import { Initialize } from '../pages/loginPage';
import { currentYear } from '../pages/pageUtils';
import { DataSetup } from './setup';
import { F3XAggregationHelpers } from '../../e2e-extended/reports/f3x/f3x-aggregation.helpers';
import { F3X, F3X_Q1 } from '../requests/library/reports';
import { buildScheduleA } from '../requests/library/transactions';

describe('Cash on Hand', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Cash on Hand Override should save', () => {
    const f3x: F3X = {
      ...F3X_Q1,
      coverage_from_date: `${currentYear-1}-01-01`,
      coverage_through_date: `${currentYear-1}-03-31`,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cy.wrap(DataSetup({ report: f3x, individual: true })).then((result: any) => {
      const firstTransaction = buildScheduleA(
        'INDIVIDUAL_RECEIPT',
        200.01,
        `${currentYear-1}-01-01`,
        result.individual,
        result.report,
      );

      return F3XAggregationHelpers.createTransaction(firstTransaction).then(() => {
        cy.visit(`/reports/f3x/summary/${result.report}/`);
        cy.contains('200.01').should('exist');
        cy.visit('/tools/update-cash-on-hand');
        cy.get('#currentAmount').should('have.value', '$200.01');
        cy.get('#year-0').click();
        cy.get('.p-select-list-container').contains('2025').click();
        cy.get('.p-select-list-container').should('not.exist');
        cy.get('#currentAmount').should('have.value', '$0.00');
        cy.get('#year-0').click();
        cy.get('.p-select-list-container').contains('2026').click();
        cy.get('.p-select-list-container').should('not.exist');
        cy.get('#newAmount').safeType('500.25');
        cy.get('.action > .p-button-primary').click();
        cy.waitForNetworkIdle(1000);
        cy.visit('/tools/update-cash-on-hand');
        cy.get('#year-0').click();
        cy.get('.p-select-list-container').contains('2026').click();
        cy.get('.p-select-list-container').should('not.exist');
        cy.get('#currentAmount').should('have.value', '$500.25');
      });
    });
  });
});
