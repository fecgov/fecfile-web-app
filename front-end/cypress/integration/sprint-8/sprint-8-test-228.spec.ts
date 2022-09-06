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
    'Transfers',
    'Joint Fundraising Transfer',
    'In-Kind Transfer',
    'In-Kind Transfer - Federal Election Activity',
    'Joint Fundraising Transfer - National Party Recount Account',
    'Joint Fundraising Transfer - National Party Convention Account',
    'Joint Fundraising Transfer - National Party Headquarters Account',
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
    'Individual National Party Recount Account',
    'Party National Party Recount Account',
    'PAC National Party Recount Account',
    'Tribal National Party Recount Account',
    'Individual National Party Headquarters Buildings Account',
    'Party National Party Headquarters Buildings Account',
    'PAC National Party Headquarters Buildings Account',
    'Tribal National Party Headquarters Buildings Account',
    'Individual National Party Convention Account',
    'Party National Party Convention Account',
    'PAC National Party Convention Account',
    'Tribal National Party Convention Account',
    'Earmark Receipt for Recount Account (Contribution)',
    'Earmark Receipt for Convention Account (Contribution)',
    'Earmark Receipt for Headquarters Account (Contribution)',
  ],
};

describe('QA Script 228 (Sprint 8)', () => {
  it('Step 1: Log in, navigate to the reports page, create a report, and set it up to be ready for transactions', () => {
    cy.login();
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    const report: object = generateReportObject();
    cy.createReport(report);
    cy.medWait();
  });

  it('Step 2: Select the edit button for the created report', () => {
    cy.navigateToTransactionManagement();
    cy.shortWait();
  });

  it('Step 3: Select the "Add new transaction" button', () => {
    cy.get('button[label="Add new transaction"]').click();
    cy.shortWait();
  });

  it('Step 4: Check the accordian tab headers', () => {
    for (const header of Object.keys(accordion)) {
      cy.get('p-accordion').contains(header).should('exist').click();
      for (const transaction of accordion[header]) {
        cy.get('p-accordion').contains('p-accordion', header).should('contain', transaction);
      }
    }
  });

  it('Cleanup', () => {
    cy.deleteAllReports();
    cy.logout();
  });
});
