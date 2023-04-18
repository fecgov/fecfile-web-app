export class ReportListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
  }

  static clickCreateButton() {
    cy.get("button[label='Create a new report']").click();
    cy.get('button').contains('Start building report').click();
  }

  //Deletes all reports belonging to the logged-in committee
  static deleteAllReports() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/f3x-summaries/',
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
        url: `http://localhost:8080/api/v1/f3x-summaries/${reportID}/`,
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }
}
