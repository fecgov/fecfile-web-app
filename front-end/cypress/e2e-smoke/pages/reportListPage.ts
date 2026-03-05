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
    cy.get('[data-cy="create-report"]').click({ force });
    cy.get('#typeDropdown').click();
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
    cy.get('[data-cy="form-1m-component"]').should('exist');
  }

  static createF24(report = defaultForm24Data) {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F24', true, false);
    cy.get('p-togglebutton').contains(`${report.report_type_24_48} Hour`).should('exist').click();
    cy.get('[data-cy="start-report"]').click();
  }

  static editReport(reportName: string, fieldName = 'Edit') {
    ReportListPage.goToPage();
    cy.contains('td', reportName, { timeout: 10000 }).should('be.visible');
    PageUtils.clickKababItem(reportName, fieldName);
  }

  static submitReport(reportName: string) {
    ReportListPage.editReport(reportName);
    PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
    PageUtils.clickSidebarItem('Submit report');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('#filingPassword').type(''); // Insert password from env variable
    cy.get(alias).find('.p-checkbox').click();
    PageUtils.clickButton('Submit');
    PageUtils.clickButton('Yes');
    ReportListPage.goToPage();
  }

  // Backward-compatible alias used by existing smoke specs.
  static goToReportList(reportId: string, includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    return ReportListPage.goToReportListPage(reportId, includeReceipts, includeDisbursements, includeLoans);
  }

  static goToReportListPage(reportId: string, includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    ReportListPage.registerReportListInterceptions(reportId, includeReceipts, includeDisbursements, includeLoans);
    const visit = cy.visit(`/reports/transactions/report/${reportId}/list`);
    return ReportListPage.checkReportListPageLoaded(reportId, includeReceipts, includeDisbursements, includeLoans, visit);
  }

  private static checkReportListPageLoaded(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
    visit: Cypress.Chainable = cy.wrap(null),
  ) {
    return visit.then(() => {
      cy.location('pathname').should('include', `/reports/transactions/report/${reportId}/list`);
      cy.contains('Transactions in this report').should('be.visible');
      ReportListPage.waitForReportListRequests(includeReceipts, includeDisbursements, includeLoans);
    });
  }

  private static registerReportListInterceptions(
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

  private static waitForReportListRequests(includeReceipts = true, includeDisbursements = true, includeLoans = true) {
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
