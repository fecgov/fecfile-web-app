// @ts-check

import { enterContact } from '../../support/contacts.spec';
import { generateReportObject } from '../../support/generators/reports.spec';
import { generateTransactionObject } from '../../support/generators/transactions.spec';
import { createTransactionSchA } from '../../support/transactions.spec';

describe('QA Script 244 (Sprint 8)', () => {
  after(() => {
    cy.login();
    cy.visit('/dashboard');
    cy.deleteAllReports();
  });

  it('', () => {
    //Step 1: Log in, navigate to the reports page, create a report, and set it up to be ready for transactions
    cy.login();
    cy.visit('/dashboard');
    cy.url().should('contain', '/dashboard');
    cy.medWait();
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Reports').click();
    cy.url().should('contain', '/reports');

    const report = generateReportObject();
    cy.createReport(report);

    //Step 2: Select the edit button for the created report
    cy.navigateToTransactionManagement();

    //Step 3: Verify that you are on the "Transactions" page
    cy.get("div[role='toolbar']").contains('Transactions').should('exist');

    //Step 4: Create a Joint Fundraising Transfer MEMO transaction
    const transaction = generateTransactionObject({ transaction_name: 'Joint Fundraising Transfer' });
    createTransactionSchA(transaction, false);
    cy.get('p-dropdown[formcontrolname="subTransaction"]').click();
    cy.contains('li', 'PAC Joint Fundraising Transfer Memo').click();
    cy.shortWait();
    cy.get('.p-confirm-dialog-accept').click();
    cy.longWait();

    cy.contains('a', 'Create a new contact').click();
    cy.longWait();
    enterContact(transaction.contact, true, true);
    cy.medWait();

    cy.contains('The dollar amount in a memo item is not incorporated into the total figure for the schedule').should(
      'exist'
    );
    cy.longWait();

    //Step 5: Open a Memo Transaction and check for the memo checkbox to be pre-selected and disabled
    cy.get('p-checkbox[formControlName="memo_code"]').find('span').should('have.class', 'pi-check');
    cy.get('p-checkbox[formControlName="memo_code"]').parent().should('have.class', 'readonly');
  });
});
