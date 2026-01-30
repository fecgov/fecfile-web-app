import { defaultScheduleFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils, currentYear } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { buildScheduleA } from '../requests/library/transactions';
import { makeTransaction } from '../requests/methods';
import { DataSetup } from './setup';
import { ReviewReport } from './utils/review-report';

const scheduleData = {
  ...defaultScheduleFormData,
  electionYear: undefined,
  electionType: undefined,
  date_received: new Date(currentYear, 4 - 1, 27),
};

const getTotalReceiptsText = () =>
  cy
    .contains('td', 'Total receipts (from Line 19)')
    .parent('tr')
    .find('td')
    .eq(2) // This Period column
    .invoke('text')
    .then((t) => t.trim());

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    cy.wrap(DataSetup()).then((result: any) => {
      const reportId = result.report;

      cy.intercept('POST', '**/web-services/summary/calculate-summary/').as('calcSummary');
      cy.intercept('GET', `**/reports/form-3x/${reportId}/`).as('getReport');

      cy.visit(`/reports/transactions/report/${reportId}/list`);
      ReviewReport.Summary();

      cy.wait('@calcSummary');
      cy.wait('@getReport');
      cy.get('img.fec-loader-image').should('exist');

      // capture UI total before leaving summary
      getTotalReceiptsText().then((before) => {
        // Leave summary and come back to verify calc does NOT run
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        ReviewReport.Summary();

        // expect no calcSummary this time; loader should not appear
        cy.get('img.fec-loader-image').should('not.exist');

        // verify totals unchanged on repeat visit
        getTotalReceiptsText().should('eq', before);
      });
    });
  });

  it('should recalculate after transaction created or updated', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      const reportId = result.report;

      cy.intercept('POST', '**/web-services/summary/calculate-summary/').as('calcSummary');
      cy.intercept('GET', `**/reports/form-3x/${reportId}/`).as('getReport');

      // check summary calc runs
      ReportListPage.goToReportList(reportId);
      ReviewReport.Summary();

      cy.wait('@calcSummary');
      cy.wait('@getReport');
      cy.get('img.fec-loader-image').should('exist');

      // Create transaction
      const transaction = buildScheduleA(
        'INDIVIDUAL_RECEIPT',
        200.01,
        `${currentYear}-04-12`,
        result.individual,
        reportId
      );

      makeTransaction(transaction, () => {
        // Go to summary and verify summary calc runs
        ReviewReport.Summary();
        cy.wait('@calcSummary');
        cy.wait('@getReport');
        cy.get('img.fec-loader-image').should('exist');

        // capture UI total before "no‑calc" revisit
        getTotalReceiptsText().then((before) => {
          // Verify summary calc doesn't run again
          PageUtils.clickSidebarItem('ENTER A TRANSACTION');
          PageUtils.clickSidebarItem('Manage your transactions');
          ReviewReport.Summary();
          cy.get('img.fec-loader-image').should('not.exist');

          // verify totals unchanged on repeat visit
          getTotalReceiptsText().should('eq', before);
        });

        // Update transaction
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        cy.get('tr').should('contain', 'Individual Receipt');
        PageUtils.clickLink('Individual Receipt');
        const alias = PageUtils.getAlias('');
        cy.get(alias).find('#amount').clear().safeType(123.45);
        PageUtils.clickButton('Save');
        cy.get('tr').should('contain', '$123.45');

        // Return to summary page and verify summary calc runs
        ReviewReport.Summary();
        cy.wait('@calcSummary');
        cy.wait('@getReport');
        cy.get('img.fec-loader-image').should('exist');
      });
    });
  });
});
