import { F3xCreateReportPage } from "./f3xCreateReportPage";
import { defaultFormData as defaultReportFormData } from "../models/ReportFormModel";
import { PageUtils } from "./pageUtils";

export class ReportListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.navbar-nav').find('.nav-link').contains('Reports').click();
  }

  static clickCreateButton(force = false) {
    cy.get("button[label='Create a new report']").click({force});
    cy.intercept({method: 'GET', url: 'http://localhost:8080/api/v1/reports/form-3x/coverage_dates/'}).as(
      'coverageDates'
    );
    cy.get('#typeDropdown').click();
    cy.get('button').contains('Form 3X').click();
    cy.get('button').contains('Start building report').click();
    cy.wait('@coverageDates'); // the page is ready when coverage_dates has returned
  }

  //Deletes all reports belonging to the logged-in committee
  static deleteAllReports() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/reports/',
        headers: {
          'x-csrftoken': cookie?.value,
        },
      }).then((resp) => {
        const reports = resp.body.results;
        for (const report of reports) {
          ReportListPage.deleteReport(report.id);
        }
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
    ReportListPage.clickCreateButton(true);
    F3xCreateReportPage.enterFormData(fd);
    PageUtils.clickButton('Save and continue');
  }
}
