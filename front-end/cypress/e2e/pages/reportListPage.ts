import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';
import { defaultFormData as cohFormData, F3xCashOnHandPage } from './f3xCashOnHandPage';

export class ReportListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.navbar-nav').find('.nav-link').contains('Reports').click();
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.get('[data-cy="create-report"]').click({ force });
    cy.get('#typeDropdown').click();
    cy.get(`[data-cy-form-type="${formType}"]`).click();
    if (submit) {
      cy.get('[data-cy="start-report"]').click();
    }
  }

  //Deletes all reports belonging to the logged-in committee
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

  //Deletes a single report by its ID
  static deleteReport(reportID: string) {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:8080/api/v1/reports/${reportID}/`,
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
    if (fd.cash_on_hand) {
      F3xCashOnHandPage.enterFormData({
        cashOnHand: fd.cash_on_hand.toString(),
        date: fd.coverage_from_date,
      });
    }
  }

  static createF1M() {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F1M', true);
    cy.get('[data-cy="form-1m-component"]').should('exist');
  }

  static createF24(report = defaultForm24Data) {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F24', true, false);
    cy.get('div > span').contains(`${report.report_type_24_48} Hour`).should('exist').click();
    cy.get('[data-cy="start-report"]').click();
  }

  static editReport(reportName: string, fieldName = 'Edit report') {
    ReportListPage.goToPage();
    cy.wait(500);
    PageUtils.getKabob(reportName).contains(fieldName).first().click({ force: true });
    cy.wait(500);
  }

  static submitReport(reportName: string, fd = cohFormData) {
    ReportListPage.editReport(reportName);
    F3xCashOnHandPage.enterFormData(fd);
    PageUtils.clickButton('Save & continue');
    PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
    PageUtils.clickSidebarItem('Submit report');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('#filingPassword').type(''); // Insert password from env variable
    cy.get(alias).find('.p-checkbox').click();
    PageUtils.clickButton('Submit');
    PageUtils.clickButton('Yes');
    ReportListPage.goToPage();
  }
}
