import { PageUtils } from '../../pages/pageUtils';
import { ApiUtils } from '../../utils/api';

type VisitSummaryWithSpinnerOptions = {
  expectSpinner: boolean;
  aliasName?: string;
  spinnerDelayMs?: number;
  spinnerGoneTimeout?: number;
};

export class ReviewReport {
  static Summary() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View summary page');
  }

  static DSP() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View detailed summary page');
  }

  static PrintPreview() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('View print preview');
  }

  static AddReportLevelMemo() {
    PageUtils.clickSidebarItem('REVIEW A REPORT');
    PageUtils.clickSidebarItem('Add a report level memo');
  }

  static setupSummarySpinner(reportId: string, delayMs = 1200, alias = 'getReport') {
    let requestCount = 0;
    let shouldDelaySecondRequest = false;

    cy.intercept(
      {
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname(`/reports/form-3x/${reportId}/`),
      },
      (req) => {
        req.alias = alias;
        req.continue((res) => {
          requestCount += 1;
          if (requestCount === 1) {
            shouldDelaySecondRequest = res.body?.calculation_status !== 'SUCCEEDED';
            return;
          }
          if (requestCount === 2 && shouldDelaySecondRequest) {
            res.setDelay(delayMs);
          }
        });
      },
    );

    return `@${alias}`;
  }

  static visitSummaryWithSpinner(
    reportId: string,
    {
      expectSpinner,
      aliasName,
      spinnerDelayMs = 1200,
      spinnerGoneTimeout = 20000,
    }: VisitSummaryWithSpinnerOptions,
  ) {
    let getReportAlias = '';
    if (expectSpinner) {
      getReportAlias = ReviewReport.setupSummarySpinner(
        reportId,
        spinnerDelayMs,
        aliasName ?? 'getReport',
      );
    }

    // Direct navigation avoids flaky no-op sidebar clicks when already on summary.
    cy.visit(`/reports/f3x/summary/${reportId}`);
    PageUtils.locationCheck(`/reports/f3x/summary/${reportId}`);

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

      // Explicitly prove a second report fetch/recalc cycle occurred.
      cy.wait(getReportAlias).its('response.statusCode').should('eq', 200);
      ReviewReport.assertSpinnerGone(spinnerGoneTimeout);
    });
  }

  static assertSpinnerVisible(timeout = 10000) {
    cy.get('img.fec-loader-image', { timeout }).should('be.visible');
  }

  static assertSpinnerGone(timeout = 20000) {
    cy.get('img.fec-loader-image', { timeout }).should('not.exist');
  }
}
