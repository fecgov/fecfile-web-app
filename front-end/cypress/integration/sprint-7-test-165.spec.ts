// @ts-check

//    QA Script 165 does not specify either creating reports or checking if their ordering responds accordingly
//                  Double check with Shelly to ensure a proper understanding of the test script
//import { GenerateReportObject, EnterReport } from '../support/reports.spec';

describe('QA Test Script #165 (Sprint 7)', () => {
  it('Step 1: Navigate to contacts page and populate it with one report', () => {
    cy.Login();
    cy.url().should('contain', '/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    //const report1 = GenerateReportObject();
    //cy.EnterReport(report1);
  });

  it('Steps 2-13: Check for sortability on each column', () => {
    const Columns: Array<string> = ['Form type', 'Type of report', 'Coverage dates', 'Status', 'Version', 'Date filed'];
    let Column: string;
    for (Column of Columns) {
      cy.get('th')
        .contains(Column)
        .should('contain', Column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-up-alt');
    }
    for (Column of Columns) {
      cy.get('th')
        .contains(Column)
        .should('contain', Column)
        .find('p-sorticon')
        .should('exist')
        .click()
        .click()
        .find('i')
        .should('have.class', 'pi-sort-amount-down');
    }
  });
});
