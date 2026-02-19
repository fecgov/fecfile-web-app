import { Initialize } from '../pages/loginPage';
import { PageUtils, currentYear } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { buildScheduleA } from '../requests/library/transactions';
import { makeTransaction } from '../requests/methods';
import { DataSetup } from './setup';
import { ReviewReport } from './utils/review-report';
import { SmokeAliases } from '../utils/aliases';

const REVIEW_REPORT_ALIAS_SOURCE = 'reviewReportSpec';

let summaryVisitCount = 0;

function nextSummaryAlias() {
  summaryVisitCount += 1;
  return SmokeAliases.reviewReport.getReport(summaryVisitCount, REVIEW_REPORT_ALIAS_SOURCE);
}

describe('Receipt Transactions', () => {
  beforeEach(() => {
    summaryVisitCount = 0;
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    // Create report and check summary calc runs
    DataSetup().then((result: any) => {
      const reportId = result.report;
      cy.visit(`/reports/transactions/report/${reportId}/list`);
      ReviewReport.visitSummaryWithSpinner(reportId, {
        expectSpinner: true,
        aliasName: nextSummaryAlias(),
      });

      // Leave summary and come back to verify calc does NOT run
      PageUtils.clickSidebarItem('ENTER A TRANSACTION');
      PageUtils.clickSidebarItem('Manage your transactions');
      ReviewReport.visitSummaryWithSpinner(reportId, { expectSpinner: false });
    });
  });

  it('should recalculate after transaction created or updated', () => {
    DataSetup({ individual: true }).then((result: any) => {
      // check summary calc runs
      ReportListPage.goToReportList(result.report);
      ReviewReport.visitSummaryWithSpinner(result.report, {
        expectSpinner: true,
        aliasName: nextSummaryAlias(),
      });

      // Create transaction
      const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, `${currentYear}-04-12`, result.individual, result.report);
      makeTransaction(transaction, () => {
        // Go to summary and verify summary calc runs
        ReviewReport.visitSummaryWithSpinner(result.report, {
          expectSpinner: true,
          aliasName: nextSummaryAlias(),
        });

        // Verify summary calc doesn't run again
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        ReviewReport.visitSummaryWithSpinner(result.report, { expectSpinner: false });

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
        ReviewReport.visitSummaryWithSpinner(result.report, {
          expectSpinner: true,
          aliasName: nextSummaryAlias(),
        });
      });
    });
  });
});
