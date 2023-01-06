import { generateReportObject } from '../../support/generators/reports.spec';

describe('Tests that TER reports have the F3XT form type', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  for (let filing_frequency of ['QUARTERLY', 'MONTHLY']) {
    it(`Test that a ${filing_frequency} report is of type F3XT when it has a "TER" report code`, () => {
      cy.login();
      cy.visit('/dashboard');

      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.shortWait();

      const reportObject = generateReportObject({ filing_frequency: filing_frequency, report_code: '(TER)' });
      cy.createReport(reportObject);
      cy.navigateToTransactionManagement({
        reportCode: reportObject.report_code,
      });

      cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
      cy.shortWait();
      cy.get('tr').contains('Termination').should('exist');

      cy.then(() => {
        cy.getCookie('csrftoken').then(cookie => {
          cy.request({
            method: 'GET',
            url: 'http://localhost:8080/api/v1/f3x-summaries/',
            headers: {
              'x-csrftoken': cookie?.value,
            },
          }).then((resp) => {
            const reports = resp.body.results;
            for (const report of reports) {
              cy.expect(report.form_type).to.eq('F3XT');
            }
          });
        });
      });
    });
  }
});
