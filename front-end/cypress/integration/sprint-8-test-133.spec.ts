// @ts-check

import { randomDate, generateReportObject, deleteAllReports, enterReport } from '../support/reports.spec';
import { generateContactObject } from '../support/contacts.spec';
import { getAuthToken } from '../support/commands';

// prettier-ignore
const stateCodes = {'ALABAMA': 'AL', 'ALASKA': 'AK', 'AMERICAN SAMOA': 'AS', 'ARIZONA': 'AZ', 'ARKANSAS': 'AR', 'CALIFORNIA': 'CA', 'COLORADO': 'CO', 'CONNECTICUT': 'CT', 'DELAWARE': 'DE', 'DISTRICT OF COLUMBIA': 'DC', 'FLORIDA': 'FL', 'GEORGIA': 'GA', 'GUAM': 'GU', 'HAWAII': 'HI', 'IDAHO': 'ID', 'ILLINOIS': 'IL', 'INDIANA': 'IN', 'IOWA': 'IA', 'KANSAS': 'KS', 'KENTUCKY': 'KY', 'LOUISIANA': 'LA', 'MAINE': 'ME', 'MARYLAND': 'MD', 'MASSACHUSETTS': 'MA', 'MICHIGAN': 'MI', 'MINNESOTA': 'MN', 'MISSISSIPPI': 'MS', 'MISSOURI': 'MO', 'MONTANA': 'MT', 'NEBRASKA': 'NE', 'NEVADA': 'NV', 'NEW HAMPSHIRE': 'NH', 'NEW JERSEY': 'NJ', 'NEW MEXICO': 'NM', 'NEW YORK': 'NY', 'NORTH CAROLINA': 'NC', 'NORTH DAKOTA': 'ND', 'NORTHERN MARIANA IS': 'MP', 'OHIO': 'OH', 'OKLAHOMA': 'OK', 'OREGON': 'OR', 'PENNSYLVANIA': 'PA', 'PUERTO RICO': 'PR', 'RHODE ISLAND': 'RI', 'SOUTH CAROLINA': 'SC', 'SOUTH DAKOTA': 'SD', 'TENNESSEE': 'TN', 'TEXAS': 'TX', 'UTAH': 'UT', 'VERMONT': 'VT', 'VIRGINIA': 'VA', 'VIRGIN ISLANDS': 'VI', 'WASHINGTON': 'WA', 'WEST VIRGINIA': 'WV', 'WISCONSIN': 'WI', 'WYOMING': 'WY'}

const contact = generateContactObject({ apartment: '' }); //Leveraging its address generator
let authToken: string;

describe('QA Test Script #133 (Sprint 8)', () => {
  const fromDate: Date = randomDate();
  const throughDate: Date = randomDate();

  it('Step 1: Navigate to reports page and create a report', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.wait(250);
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    let report: object = generateReportObject();
    cy.enterReport(report);
    cy.wait(250);
  });

  it('Step 2: Edit a report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
  });

  it('Step 3: Set the "Has your address changed" radio-button to "NO"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']").contains('NO').parent().find('.p-radiobutton').click();
  });

  it('Step 4: Click the "Save" button', () => {
    cy.get("button[label='Save']").click();
    cy.wait(250);
  });

  it('Step 5: Check for the "Success" toast', () => {
    cy.get('.p-toast-summary').should('contain', 'Success');
  });

  it('Step 6: Go back', () => {
    cy.get("button[label='Back']").click();
  });

  it('Delete previous report and make a new one', () => {
    let report: object = generateReportObject();
    cy.wait(50);
    cy.deleteAllReports();
    cy.enterReport(report);
  });

  it('Step 7: Reopen the report', () => {
    cy.get("p-button[icon='pi pi-pencil']").first().click();
    cy.wait(50);
  });

  it('Step 9: Set the "Has your address changed" radio-button to "YES"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
  });

  it('Step 10: Verify that the "Address" fields are displayed', () => {
    cy.get("input[formControlName='street_1']").should('exist');
    cy.get("input[formControlName='street_2']").should('exist');
    cy.get("input[formControlName='city']").should('exist');
    cy.get("input[formControlName='zip']").should('exist');
    cy.get("p-dropdown[formControlName='state']").should('exist');
  });

  it('Step 11: Update the address', () => {
    cy.get("input[formControlName='street_1']").safeType('{selectAll}').safeType(contact['street']);
    cy.get("input[formControlName='street_2']").safeType('{selectAll}').safeType(contact['apartment']);
    cy.get("input[formControlName='city']").safeType('{selectAll}').safeType(contact['city']);
    cy.get("input[formControlName='zip']").safeType('{selectAll}').safeType(contact['zip']);
    cy.dropdownSetValue("p-dropdown[formControlName='state']", contact['state']);
    cy.get("button[label='Save']").click();
    cy.wait(250);
  });

  it('Step 12: Check that the address changed', () => {
    let authToken: string = getAuthToken();
    cy.request({
      method: 'GET',
      url: 'http://localhost:8080/api/v1/f3x-summaries/',
      headers: {
        Authorization: authToken,
      },
    }).then((resp) => {
      let report = resp.body.results[0];
      console.log(contact);
      console.log(report);
      cy.expect(report.street_1).to.eql(contact['street']);
      cy.expect(report.city).to.eql(contact['city']);
      cy.expect(report.zip).to.eql(contact['zip']);

      if (contact['apartment'] != '') cy.expect(report.street_2).to.eql(contact['apartment']);
      else cy.expect(report.street_2).to.be.null;

      let state: string = contact['state'];
      let stateCode: string = stateCodes[state.toUpperCase()];
      cy.expect(report.state).to.eql(stateCode);
    });
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
