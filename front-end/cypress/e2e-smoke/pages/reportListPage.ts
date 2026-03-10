import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';
import { buildDataCy } from '../../utils/dataCy';

export class ReportListPage {
  static goToPage() {
    cy.intercept('GET', 'http://localhost:8080/api/v1/reports/**').as('GetReports');
    cy.visit('/reports');
    cy.wait('@GetReports');
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.getByDataCy('report-list-page-create-report-button').click({ force });
    cy.getByDataCy('report-list-dialog-form-type-select').click({ force: true });
    if (formType === 'F24') {
      cy.getByDataCy('report-list-dialog-form-type-f24-option').should('contain', '24/48 Hour Report of Independent Expenditure');
    }
    cy.getByDataCy(buildDataCy('report-list', 'dialog', 'form-type', formType, 'option')).click();
    if (submit) {
      cy.getByDataCy('report-list-dialog-submit-button').click();
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
    cy.getByDataCy('report-list-dialog-form24-type-select').contains(`${report.report_type_24_48}-Hour`).should('exist').click();
    cy.getByDataCy('report-list-dialog-submit-button').click();
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
    cy.getByDataCy('report-submit-page-filing-password-input').type(Cypress.env('FILING_PASSWORD'));
    cy.getByDataCy('report-submit-page-user-certified-checkbox').click({ force: true });
    cy.getByDataCy('report-submit-page-submit-button').click();
    cy.getByDataCy('layout-confirm-dialog-submit-button').click();
    ReportListPage.goToPage();
  }

  static goToReportList(reportId: string, includeReceipts = true, includeDisbursements = true, includeLoans = true) {
    if (includeReceipts) {
      cy.intercept({
        method: 'GET',
        pathname: '/api/v1/transactions/',
        query: {
          report_id: reportId,
          schedules: 'A',
          page: '1',
          ordering: 'line_label,created',
          page_size: '5',
        },
      }).as('GetReceipts');
    }

    if (includeLoans) {
      cy.intercept({
        method: 'GET',
        pathname: '/api/v1/transactions/',
        query: {
          report_id: reportId,
          schedules: 'C,D',
          page: '1',
          ordering: 'line_label,created',
          page_size: '5',
        },
      }).as('GetLoans');
    }

    if (includeDisbursements) {
      cy.intercept({
        method: 'GET',
        pathname: '/api/v1/transactions/',
        query: {
          report_id: reportId,
          schedules: 'B,E,F',
          page: '1',
          ordering: 'line_label,created',
          page_size: '5',
        },
      }).as('GetDisbursements');
    }

    const visit = cy.visit(`/reports/transactions/report/${reportId}/list`);
    if (includeLoans) cy.wait('@GetLoans');
    if (includeDisbursements) cy.wait('@GetDisbursements');
    if (includeReceipts) cy.wait('@GetReceipts');
    return visit;
  }
}
