import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { Initialize } from '../pages/loginPage';
import { DataSetup } from './setup';

describe('Amendments', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Create an amendment', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
      PageUtils.clickLink('Submit report');
      PageUtils.submitReportForm();
      ReportListPage.goToPage();

      cy.get('app-table[data-cy="form3x-list-component"] tbody tr:visible').then(($rows) => {
        const amendableRows = $rows.filter(
          (_, row) => Cypress.$(row).find('app-table-actions-button button:visible').length === 1,
        );
        expect(amendableRows.length, 'amendable F3X report rows').to.be.greaterThan(0);
        cy.wrap(amendableRows.get(0)).within(() => {
          cy.get('app-table-actions-button button:visible')
            .should('have.length', 1)
            .click();
        });
      });
      cy.get('.p-popover:visible').contains(/^\s*Amend\s*$/).click();

      PageUtils.containedOnPage('Amendment 1');
    });
  });
});
