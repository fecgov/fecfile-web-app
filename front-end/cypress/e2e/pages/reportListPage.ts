import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';

export class ReportListPage {
  static goToPage() {
    cy.visit('/reports');
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.get('[data-cy="create-report"]').click({ force });
    cy.get('#typeDropdown').click();
    if (formType === 'F24') {
      cy.get(`[data-cy="${formType}"]`).should('contain', ' 24/48 Hour Report of Independent Expenditure');
    }
    cy.get(`[data-cy="${formType}"]`).click();
    if (submit) {
      cy.get('[data-cy="start-report"]').click();
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
    cy.intercept('GET', 'http://localhost:8080/api/v1/reports/**').as('GetReports');
    ReportListPage.goToPage();
    cy.wait(`@GetReports`);
    cy.wait(`@GetReports`);
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

  static goToReportList(reportId: string, includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    if (includeReceipts)
      cy.intercept(
        'GET',
        `http://localhost:8080/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=A`,
      ).as('GetReceipts');
    if (includeLoans)
      cy.intercept(
        'GET',
        `http://localhost:8080/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=C,D`,
      ).as('GetLoans');
    if (includeDisbursements)
      cy.intercept(
        'GET',
        `http://localhost:8080/api/v1/transactions/?page=1&ordering=line_label,created&page_size=5&report_id=${reportId}&schedules=B,E,F`,
      ).as('GetDisbursements');
    cy.visit(`/reports/transactions/report/${reportId}/list`);
    if (includeLoans) cy.wait('@GetLoans');
    if (includeDisbursements) cy.wait('@GetDisbursements');
    if (includeReceipts) cy.wait('@GetReceipts');

    // Can go away after double fetch fix
    if (includeLoans) cy.wait('@GetLoans');
    if (includeDisbursements) cy.wait('@GetDisbursements');
    if (includeReceipts) cy.wait('@GetReceipts');
  }
}
