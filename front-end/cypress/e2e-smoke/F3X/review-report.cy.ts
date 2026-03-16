import { defaultScheduleFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { PageUtils, currentYear } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
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

let summaryReportId: string | null = null;
let summaryExpectSpinner = false;
let summarySeen = 0;
let summaryShouldDelay = false;

function visitSummaryWithSpinner(reportId: string, expectSpinner: boolean) {
  // configure which reportId this visit should track and whether a spinner is expected
  summaryReportId = reportId;
  summaryExpectSpinner = expectSpinner;
  summarySeen = 0;
  summaryShouldDelay = false;

  if (expectSpinner) {
    // if already on summary, leave first so the resolver GET reliably re-fires
    cy.location('pathname').then((path) => {
      if (path.includes('/reports/f3x/summary/')) {
        PageUtils.clickSidebarItem('Manage your transactions');
      }
    });
  }

  ReviewReport.Summary();
  if (!expectSpinner) {
    cy.get('img.fec-loader-image').should('not.exist');
    return;
  }

  // 1st GET tells if calc already finished, only then require spinner
  cy.wait('@getReport').then(({ response }) => {
    const shouldShow = response?.body?.calculation_status !== 'SUCCEEDED';
    if (!shouldShow) {
      cy.get('img.fec-loader-image').should('not.exist');
      return;
    }
    // 2nd GET (if any) is delayed to keep the spinner visible long enough to assert
    cy.get('img.fec-loader-image').should('be.visible');
    cy.wait('@getReport');
    cy.get('img.fec-loader-image').should('not.exist');
  });
}

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
    // reset per-visit tracking so report GET aliasing has per-test determinism
    summaryReportId = null;
    summaryExpectSpinner = false;
    summarySeen = 0;
    summaryShouldDelay = false;

    // per-test GETs intercept report, aliasing only the current reportId
    cy.intercept('GET', /\/api\/v1\/reports\/(form-3x\/)?[^/]+\/$/, (req) => {
      const match = new RegExp(/\/api\/v1\/reports\/(?:form-3x\/)?([^/]+)\//).exec(req.url);
      const reqReportId = match?.[1] ?? null;
      if (!summaryReportId || reqReportId !== summaryReportId) {
        req.continue();
        return;
      }

      req.alias = 'getReport';
      summarySeen += 1;
      req.continue((res) => {
        if (summarySeen === 1) {
          summaryShouldDelay = summaryExpectSpinner && res.body?.calculation_status !== 'SUCCEEDED';
          return;
        } // delay only the refresh GET when spinner is expected
        if (summarySeen === 2 && summaryShouldDelay) {
          res.setDelay(1200);
        }
      });
    });
  });

  it('should calculate summary values on first visit', () => {
    // Create report and check summary calc runs
    cy.wrap(DataSetup()).then((result: any) => {
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
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      // check summary calc runs
      ReportListPage.gotToReportTransactionListPage(result.report);
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
        TransactionDetailPage.clickSave();
        cy.get('tr').should('contain', '$123.45');

        // Return to summary page and verify summary calc runs
        visitSummaryWithSpinner(result.report, true);
      });
    });
  });
});
