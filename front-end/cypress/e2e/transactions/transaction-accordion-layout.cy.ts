// @ts-check

import { generateReportObject } from '../../support/generators/reports.spec';

const accordion = {
  'CONTRIBUTIONS FROM INDIVIDUALS': [
    'Individual Receipt',
    'Tribal Receipt',
    'Partnership Receipt',
    'Reattribution',
    'In-Kind Receipt',
    'Returned/Bounced Receipt (Individual)',
    'Earmark Receipt',
    'Conduit Earmark (Deposited)',
    'Conduit Earmark (Undeposited)',
    'Unregistered Receipt from Person',
    'Unregistered Receipt from Person - Returned/Bounced Receipt',
  ],
  'CONTRIBUTIONS FROM REGISTERED': [
    'Party Receipt',
    'Party In-Kind',
    'Returned/Bounced Receipt (Party)',
    'PAC Receipt',
    'PAC In-Kind',
    'PAC Earmark Receipt',
    'PAC Conduit Earmark (Deposited)',
    'PAC Conduit Earmark (Undeposited)',
    'Returned/Bounced Receipt (PAC)',
  ],
  TRANSFERS: [
    'Transfer',
    'Joint Fundraising Transfer',
    'In-Kind Transfer',
    'In-Kind Transfer - Federal Election Activity',
    'Joint Fundraising Transfer - National Party Recount/Legal Proceedings Account',
    'Joint Fundraising Transfer - National Party Pres. Nominating Convention Account',
    'Joint Fundraising Transfer - National Party Headquarters Buildings Account',
  ],
  REFUNDS: ['Refunds of Contributions to Registered Committees', 'Refunds of Contributions to Unregistered Committees'],
  OTHER: [
    'Offsets to Operating Expenditures',
    'Other Receipts',
    'Individual Receipt - Non-Contribution Account',
    'Other Committee Receipt - Non-Contribution Account',
    'Business/Labor Organization Receipt - Non-Contribution Account',
    'Individual Recount Receipt',
    'Party Recount Receipt',
    'PAC Recount Receipt',
    'Tribal Recount Receipt',
    'Individual National Party Recount/Legal Proceedings Account',
    'Party National Party Recount/Legal Proceedings Account',
    'PAC National Party Recount/Legal Proceedings Account',
    'Tribal National Party Recount/Legal Proceedings Account',
    'Individual National Party Headquarters Buildings Account',
    'Party National Party Headquarters Buildings Account',
    'PAC National Party Headquarters Buildings Account',
    'Tribal National Party Headquarters Buildings Account',
    'Individual National Party Pres. Nominating Convention Account',
    'Party National Party Pres. Nominating Convention Account',
    'PAC National Party Pres. Nominating Convention Account',
    'Tribal National Party Pres. Nominating Convention Account',
    'Earmark Receipt for Recount Account (Contribution)',
    'Earmark Receipt for Convention Account (Contribution)',
    'Earmark Receipt for Headquarters Account (Contribution)',
  ],
};

describe("Tests the transaction accordion's layout", () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  it("Tests the transaction accordion's layout", () => {
    //Step 1: Log in, navigate to the reports page, create a report, and set it up to be ready for transactions
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    const report: object = generateReportObject();
    cy.createReport(report);
    cy.medWait();

    //Step 2: Select the edit button for the created report
    cy.navigateToTransactionManagement();
    cy.shortWait();

    //Step 3: Select the "Add new transaction" button
    cy.get('button[label="Add new transaction"]').click();
    cy.shortWait();

    //Step 4: Check the accordian tab headers
    for (const header of Object.keys(accordion)) {
      cy.get('p-accordion').contains(header).should('exist').click();
      for (const transaction of accordion[header]) {
        cy.get('p-accordion').contains('p-accordion', header).should('contain', transaction);
      }
    }
  });
});
