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

function visitSummaryWithSpinner(reportId: string, expectSpinner: boolean) {
  const getReportAlias = ReviewReport.setupSummarySpinner(reportId, 1200);

  ReviewReport.Summary();

  if (!expectSpinner) {
    ReviewReport.assertSpinnerGone();
    return;
  }

  cy.wait(getReportAlias).then(({ response }) => {
    const shouldShowSpinner = response?.body?.calculation_status !== 'SUCCEEDED';
    if (!shouldShowSpinner) {
      ReviewReport.assertSpinnerGone();
      return;
    }

    ReviewReport.assertSpinnerVisible();

    // Do not require a second alias wait.
    ReviewReport.assertSpinnerGone(20000);
  });
}

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    // Create report and check summary calc runs
    DataSetup().then((result: any) => {
      const reportId = result.report;
      cy.visit(`/reports/transactions/report/${reportId}/list`);
      visitSummaryWithSpinner(reportId, true);

      // Leave summary and come back to verify calc does NOT run
      PageUtils.clickSidebarItem('ENTER A TRANSACTION');
      PageUtils.clickSidebarItem('Manage your transactions');
      visitSummaryWithSpinner(reportId, false);
    });
  });

  it('should recalculate after transaction created or updated', () => {
    DataSetup({ individual: true }).then((result: any) => {
      // check summary calc runs
      ReportListPage.goToReportList(result.report);
      visitSummaryWithSpinner(result.report, true);

      // Create transaction
      const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, `${currentYear}-04-12`, result.individual, result.report);
      makeTransaction(transaction, () => {
        // Go to summary and verify summary calc runs
        visitSummaryWithSpinner(result.report, true);

        // Verify summary calc doesn't run again
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        visitSummaryWithSpinner(result.report, false);

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
        visitSummaryWithSpinner(result.report, true);
      });
    });
  });
});
