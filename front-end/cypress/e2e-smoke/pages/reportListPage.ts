import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

export class ReportListPage {
  static goToPage() {
    cy.intercept('GET', 'http://localhost:8080/api/v1/reports/**').as('GetReports');
    cy.visit('/reports');
    cy.wait('@GetReports');
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.get('[data-cy="create-report"]:visible').click({ force });
    cy.get('#typeDropdown:visible').click();
    if (formType === 'F24') {
      cy.get(`[data-cy="${formType}"]`).should('contain', ' 24/48 Hour Report of Independent Expenditure');
    }
    cy.get(`[data-cy="${formType}"]`).click();
    if (submit) {
      cy.contains('Start building report').click();
    }
  }

  static deleteAllReports() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/reports/e2e-delete-all-reports/',
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }

  static createF3X(fd = defaultReportFormData) {
    ReportListPage.goToPage();
    F3xCreateReportPage.coverageCall();
    ReportListPage.clickCreateAndSelectForm('F3X');
    F3xCreateReportPage.waitForCoverage();
    F3xCreateReportPage.enterFormData(fd);
    PageUtils.clickButton('Save and continue');
  }

  static createF1M() {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F1M', true);
    cy.get('[data-cy="form-1m-component"]').should('be.visible');
  }

  static createF24(report = defaultForm24Data) {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F24', true, false);
    cy.get('p-togglebutton').contains(`${report.report_type_24_48} Hour`).should('be.visible').click();
    cy.get('[data-cy="start-report"]:visible').click();
  }

  static gotToReportTransactionListPage(reportId: string, includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    return ReportListPage.checkReportTransactionListPageLoaded(
      reportId,
      includeReceipts,
      includeDisbursements,
      includeLoans,
      cy.visit(`/reports/transactions/report/${reportId}/list`),
    );
  }

  private static checkReportTransactionListPageLoaded(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
    visit: Cypress.Chainable = cy.wrap(null),
  ) {
    ReportListPage.registerReporTransactiontListInterceptions(reportId, includeReceipts, includeDisbursements, includeLoans);

    return visit.then(() => {
      cy.location('pathname').should('include', `/reports/transactions/report/${reportId}/list`);
      cy.contains('Transactions in this report').should('be.visible');
      ReportListPage.waitForReportTransactionListRequests(includeReceipts, includeDisbursements, includeLoans);
    });
  }

  private static registerReporTransactiontListInterceptions(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
  ) {
    const configs = [
      { enabled: includeReceipts, alias: 'GetReceipts', schedules: 'A' },
      { enabled: includeLoans, alias: 'GetLoans', schedules: 'C,D' },
      { enabled: includeDisbursements, alias: 'GetDisbursements', schedules: 'B,E,F' },
    ] as const;

    configs.forEach(({ enabled, alias, schedules }) => {
      if (!enabled) return;
      cy.intercept({
        method: 'GET',
        pathname: '/api/v1/transactions/',
        query: {
          report_id: reportId,
          schedules,
        },
      }).as(alias);
    });
  }

  private static waitForReportTransactionListRequests(includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    const waits = [
      { enabled: includeLoans, alias: 'GetLoans' },
      { enabled: includeDisbursements, alias: 'GetDisbursements' },
      { enabled: includeReceipts, alias: 'GetReceipts' },
    ] as const;

    waits.forEach(({ enabled, alias }) => {
      if (!enabled) return;
      cy.wait(`@${alias}`);
    });
  }
}
