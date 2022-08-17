import { getAuthToken } from '../../support/commands';
import { generateReportObject } from '../../support/generators/reports.spec';

describe('Sprint 9 QA Script 98', () => {
  before('Logs in and creates a dummy report', () => {
    cy.login();
  });

  for (let filing_frequency of ['QUARTERLY', 'MONTHLY']) {
    it(`Test that a ${filing_frequency} report is of type F3XT when it has a "TER" report code`, () => {
      cy.deleteAllReports();

      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.shortWait();

      const reportObject = generateReportObject({ filing_frequency: filing_frequency, report_code: '(TER)' });
      cy.createReport(reportObject);
      console.log(reportObject.report_code);
      cy.navigateToTransactionManagement({
        reportCode: reportObject.report_code,
      })

      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.shortWait();
      cy.get('tr').contains('Termination').should('exist');

      const authToken: string = getAuthToken();
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/f3x-summaries/',
        headers: {
          Authorization: authToken,
        },
      }).then((resp) => {
        const reports = resp.body.results;
        for (const report of reports) {
          console.log(report);
          cy.expect(report.form_type).to.eq('F3XT');
        }
      });
    });
  }

  it('Cleans up', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
