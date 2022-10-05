// @ts-check

import { randomString } from '../../support/generators/generators.spec';
import { generateReportObject } from '../../support/generators/reports.spec';

const report = generateReportObject();

describe('Test creating a report and adding a report-level memo', () => {
  beforeEach('Logs', () => {
    cy.login();
  });

  it('Test', () => {
    cy.visit('/dashboard');

    //Creates a report
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.createReport(report);

    //Progresses to the Transaction Management Page
    cy.navigateToTransactionManagement();

    //Submits a report level memo
    cy.navigateReportSidebar('Review', 'Add a report level memo');
    cy.shortWait();

    const text = randomString(4000, 'special', false);
    cy.get('textarea').overwrite(text).safeType('A');

    cy.get('app-error-messages').should('contain', 'This field cannot contain more than 4000 alphanumeric characters.');

    cy.get('textarea').safeType('{backspace}');
    cy.get('app-error-messages').should(
      'not.contain',
      'This field cannot contain more than 4000 alphanumeric characters.'
    );

    cy.get('button[label="Save & continue"]').click();
    cy.medWait();

    //Verifies that the memo was saved properly
    cy.navigateReportSidebar('Review', 'Add a report level memo');
    cy.get('textarea').should('have.value', text);

    cy.shortWait();
    cy.deleteAllReports();
  });
});
