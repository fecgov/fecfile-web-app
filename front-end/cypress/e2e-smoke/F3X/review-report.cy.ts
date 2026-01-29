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

function setupSummaryCalcAssertions(reportId: string) {
  cy.intercept('POST', '**/web-services/summary/calculate-summary/').as('calcSummary');

  const assertSummaryCalc = () =>
    cy.wait('@calcSummary').then(({ request, response }) => {
      expect(request.body).to.include({ report_id: reportId });
      expect(response?.statusCode).to.eq(200);
    });

  const assertCalcCount = (count: number, timeout = 5000) =>
    cy.get('@calcSummary.all', { timeout }).should('have.length', count);

  return { assertSummaryCalc, assertCalcCount };
}

function requestWithCookies<T>(
  options: Partial<Cypress.RequestOptions>,
): Cypress.Chainable<Cypress.Response<T>> {
  return cy.getAllCookies().then((cookies: Cypress.Cookie[]) => {
    const cookieObj: Record<string, string> = {};
    cookies.forEach((cookie) => {
      cookieObj[cookie.name] = cookie.value;
    });

    const cookieHeader = Object.entries(cookieObj)
      .map(([name, value]) => `${name}=${value}`)
      .join('; ');
    const headers: Record<string, string> = { Cookie: cookieHeader, ...(options.headers as Record<string, string>) };
    const csrfToken = cookieObj['csrftoken'];
    if (csrfToken) {
      headers['x-csrftoken'] = csrfToken;
    }

    return cy.request<T>({ ...options, headers });
  });
}

function triggerSummaryCalc(reportId: string) {
  return requestWithCookies({
    method: 'POST',
    url: 'http://localhost:8080/api/v1/web-services/summary/calculate-summary/',
    body: { report_id: reportId },
  });
}

function waitForReportTotals(
  reportId: string,
  periodExpected: number,
  ytdExpected = periodExpected,
  attempts = 20,
): Cypress.Chainable<undefined> {
  const poll = (attemptsLeft: number): void => {
    requestWithCookies<{
      L19_total_receipts_period?: number | string;
      L19_total_receipts_ytd?: number | string;
    }>({
      method: 'GET',
      url: `http://localhost:8080/api/v1/reports/form-3x/${reportId}/`,
    }).then((response) => {
      const period = Number(response.body?.L19_total_receipts_period ?? 0);
      const ytd = Number(response.body?.L19_total_receipts_ytd ?? 0);
      if (period === periodExpected && ytd === ytdExpected) return;
      if (attemptsLeft <= 0) {
        throw new Error(`Expected total receipts ${periodExpected}/${ytdExpected} but got ${period}/${ytd}`);
      }
      cy.wait(1000);
      poll(attemptsLeft - 1);
    });
  };

  return cy.then(() => {
    poll(attempts);
  });
}

function assertTotalReceipts(thisPeriod: string, ytd = thisPeriod) {
  cy.contains('td', 'Total receipts (from Line 19)')
    .parent('tr')
    .within(() => {
      cy.get('td').eq(2).should('contain', thisPeriod);
      cy.get('td').eq(3).should('contain', ytd);
    });
}

describe('Receipt Transactions', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should calculate summary values on first visit', () => {
    // create report and check summary calc runs
    cy.wrap(DataSetup()).then((result: any) => {
      const reportId = result.report;
      const { assertSummaryCalc, assertCalcCount } = setupSummaryCalcAssertions(reportId);
      cy.visit(`/reports/transactions/report/${reportId}/list`);
      ReviewReport.Summary();
      assertSummaryCalc();
      assertCalcCount(1);

      // leave summary and come back to verify calc does NOT run
      PageUtils.clickSidebarItem('ENTER A TRANSACTION');
      PageUtils.clickSidebarItem('Manage your transactions');
      ReviewReport.Summary();
      assertCalcCount(1);
    });
  });

  it('should recalculate after transaction created or updated', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      const reportId = result.report;
      const { assertSummaryCalc, assertCalcCount } = setupSummaryCalcAssertions(reportId);
      // check summary calc runs
      ReportListPage.goToReportList(reportId);
      ReviewReport.Summary();
      assertSummaryCalc();
      assertCalcCount(1);

      // create transaction
      const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, `${currentYear}-04-12`, result.individual, reportId);
      makeTransaction(transaction, () => {
        // go to summary and verify totals reflect the new transaction
        triggerSummaryCalc(reportId);
        waitForReportTotals(reportId, 200.01);
        ReviewReport.Summary();
        cy.reload();
        assertTotalReceipts('$200.01');

        // verify summary totals are unchanged on a repeat visit
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        ReviewReport.Summary();
        cy.reload();
        assertTotalReceipts('$200.01');

        // update transaction
        PageUtils.clickSidebarItem('ENTER A TRANSACTION');
        PageUtils.clickSidebarItem('Manage your transactions');
        cy.get('tr').should('contain', 'Individual Receipt');
        PageUtils.clickLink('Individual Receipt');
        const alias = PageUtils.getAlias('');
        cy.get(alias).find('#amount').clear().safeType(123.45);
        PageUtils.clickButton('Save');
        cy.get('tr').should('contain', '$123.45');

        // return to summary page and verify summary calc runs
        triggerSummaryCalc(reportId);
        waitForReportTotals(reportId, 123.45);
        ReviewReport.Summary();
        cy.reload();
        assertTotalReceipts('$123.45');
      });
    });
  });
});
