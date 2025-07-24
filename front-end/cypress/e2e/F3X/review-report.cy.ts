import { defaultScheduleFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils, currentYear } from '../pages/pageUtils';
import { buildScheduleA } from '../requests/library/transactions';
import { makeTransaction } from '../requests/methods';
import { F3XSetup } from './f3x-setup';
import { ReviewReport } from './utils/review-report';

const scheduleData = {
  ...defaultScheduleFormData,
  ...{
    electionYear: undefined,
    electionType: undefined,
    date_received: new Date(currentYear, 4 - 1, 27),
  },
};

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    // Create report and check summary calc runs
    cy.wrap(F3XSetup()).then((result: any) => {
      const reportId = result.report;
      cy.visit(`/reports/transactions/report/${reportId}/list`);
      ReviewReport.Summary();
      cy.get('img.fec-loader-image').should('exist');

      // Leave summary and come back to verify calc does NOT run
      PageUtils.clickSidebarItem('ENTER A TRANSACTION');
      PageUtils.clickSidebarItem('Manage your transactions');
      ReviewReport.Summary();
      cy.get('img.fec-loader-image').should('not.exist');
    });
  });

  it('should recalculate after transaction created or updated', () => {
    cy.wrap(F3XSetup({ individual: true })).then((result: any) => {
      // check summary calc runs
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      ReviewReport.Summary();
      cy.get('img.fec-loader-image').should('exist');

      // Create transaction
      const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, '2025-04-12', result.individual, result.report);
      makeTransaction(transaction, () => {
        // Go to summary and verify summary calc runs
        ReviewReport.Summary();
        cy.get('img.fec-loader-image').should('exist');

        // Verify summary calc doesn't run again
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        ReviewReport.Summary();
        cy.get('img.fec-loader-image').should('not.exist');

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
        cy.get('img.fec-loader-image').should('exist');
      });
    });
  });
});
