// @ts-check

import * as generator from '../../support/generators/generators.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { getAuthToken } from '../../support/commands';

const reportStreet_1: string = generator.street();
const reportStreet_2: string = generator.apartment();
const reportZip: string = generator.zipcode();
const reportCity: string = generator.city();
const reportState: string = generator.state();

describe('QA Test Script #133 (Sprint 8)', () => {
  it('Step 1: Navigate to reports page and create a report', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    let report: object = generateReportObject();
    cy.createReport(report);
  });

  it('Step 2: Edit a report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
  });

  it('Step 3: Set the "Has your address changed" radio-button to "NO"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']").contains('NO').parent().find('.p-radiobutton').click();
  });

  it('Step 4: Click the "Save" button', () => {
    cy.get("button[label='Save']").click();
    cy.longWait();
  });

  it('Step 5: Check for the "Success" toast', () => {
    cy.contains('.p-toast-summary', 'Success').should('exist');
  });

  it('Step 6: Go back', () => {
    cy.get("button[label='Back']").click();
  });

  it('Delete previous report and make a new one', () => {
    let report: object = generateReportObject();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
    cy.shortWait();
    cy.deleteAllReports();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.shortWait();
    cy.createReport(report);
  });

  it('Step 7: Reopen the report', () => {
    cy.contains('.p-menuitem-link', 'Dashboard').click();
    cy.shortWait();
    cy.contains('.p-menuitem-link', 'Reports').click();
    cy.shortWait();

    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.medWait();
  });

  it('Step 9: Set the "Has your address changed" radio-button to "YES"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
    cy.shortWait();
  });

  it('Step 10: Verify that the "Address" fields are displayed', () => {
    cy.get("input[formControlName='street_1']").should('exist');
    cy.get("input[formControlName='street_2']").should('exist');
    cy.get("input[formControlName='city']").should('exist');
    cy.get("input[formControlName='zip']").should('exist');
    cy.get("p-dropdown[formControlName='state']").should('exist');
  });

  it('Step 11: Update the address', () => {
    cy.get("input[formControlName='street_1']").overwrite(reportStreet_1);
    cy.get("input[formControlName='street_2']").overwrite(reportStreet_2);
    cy.get("input[formControlName='city']").overwrite(reportCity);
    cy.get("input[formControlName='zip']").overwrite(reportZip);
    cy.dropdownSetValue("p-dropdown[formControlName='state']", reportState);
    cy.get("button[label='Save']").click();
    cy.longWait();
  });

  it('Step 12: Check that the address changed', () => {
    const authToken = getAuthToken();
    cy.wait(500).then(() => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/f3x-summaries/',
        headers: {
          Authorization: authToken,
        },
      }).then((resp) => {
        const report = resp.body.results[0];
        cy.expect(report.street_1).to.eql(reportStreet_1);
        cy.expect(report.city).to.eql(reportCity);
        cy.expect(report.zip).to.eql(reportZip);

        if (reportStreet_2 != '') cy.expect(report.street_2).to.eql(reportStreet_2);
        else console.log(cy.expect(report.street_2).to.be.null); //SonarCloud throws a fit because it thinks this line is an 'expression' without putting it inside a useless function wrapper...

        const state = reportState;
        const stateCode: string = generator.stateCodes[state.toUpperCase()];
        cy.expect(report.state).to.eql(stateCode);
      });
    });
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
