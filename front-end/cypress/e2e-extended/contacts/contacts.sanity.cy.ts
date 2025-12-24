import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { makeContact } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, MockContact } from '../../e2e-smoke/requests/library/contacts';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';

describe('Contacts Soft and Hard Delete (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
    cy.intercept('GET', `**/api/v1/contacts/**page_size=**`).as(`getContactsList`);
  });

  it('part1: creates two contacts, soft deletes one, doubly verifies the deletion, then verifies Restore deleted contacts button', () => {
    const contacts: MockContact[] = [Individual_A_A, Individual_A_A];
    cy.wait('@getContactsList');
    cy.contains('button,a', 'Add contact').should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts')
      .should('not.exist').then(() => {
        for (const [i, contact] of contacts.entries()) {
          makeContact({
            ...contact,
            last_name: `${contact.last_name}${i}`,
            first_name: `${contact.first_name}${i}`,
          });
        }
    });
    cy.wait('@getContactsList');  
    const contactDisplayNames = contacts.map(
      (contact, i) => `${contact.last_name}${i}, ${contact.first_name}${i}`,
    );
    const contactToDelete = contactDisplayNames[0];
    const contactToPreserve = contactDisplayNames[1];
    cy.intercept('DELETE', '**/api/v1/contacts/**').as('deleteContact');
    cy.contains('tbody tr', contactToDelete, { timeout: 15000 }).should('be.visible');
    PageUtils.clickKababItem(contactToDelete, 'Delete');
    PageUtils.clickButton('Confirm');
    cy.wait('@deleteContact');
    cy.wait('@getContactsList');
    cy.contains('tbody tr', contactToDelete, { timeout: 15000 }).should('not.exist');
    cy.intercept('GET', '**/api/v1/contacts-deleted/**').as('getDeletedContacts');
    cy.contains('button,a', 'Restore deleted contacts')
      .should('be.visible')
      .click();
    cy.wait('@getDeletedContacts');
    cy.contains('h1', 'Restore deleted contacts').should('be.visible');
    cy.contains('tbody tr', contactToDelete, { timeout: 15000 }).should('be.visible');
    ContactListPage.goToPage();
    cy.wait('@getContactsList');
    cy.contains('tbody tr', contactToPreserve, { timeout: 15000 }).should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts').should('be.visible');
  });

  it('part2: triggers beforeEach--> Initialize--> deleteAllContacts(), verify Restore deleted contacts is not visible, contacts table is empty', () => {
    cy.wait('@getContactsList');
    cy.contains('button,a', 'Restore deleted contacts')
      .should('not.exist');
    cy.contains('.empty-message', 'No data available in table').should('exist');
    cy.get('.paginator-text')
      .should('be.visible')
      .and('contain', 'Showing 0 to 0 of 0 contacts:');
  });
});
