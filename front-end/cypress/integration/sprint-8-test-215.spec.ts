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

  it('Step 3: Set the "Has your address changed" radio-button to "YES"', () => {
    cy.get("p-radiobutton[formControlName='change_of_address']")
      .contains('YES')
      .parent()
      .find('.p-radiobutton')
      .click();
  });

  it('Step 4: The "Update your committee address" link should exist', () => {
    cy.get('a')
      .contains('Update your committee address')
      .should('exist')
      .parent()
      .contains(
        'Within 10 days of an address change you must notify the FEC by amending your Form 1, in addition to updating your address here.'
      )
      .should('exist');
  });

  it('Step 5: Verify that the link does not 404', () => {
    cy.get('a')
      .contains('a', 'Update your committee address')
      .then((jQueryObject) => {
        console.log(jQueryObject[0]);
        cy.request('GET', jQueryObject[0].href).its('status').should('not.eq', 404);
      });
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
