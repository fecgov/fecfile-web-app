import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { makeContact } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, MockContact } from '../../e2e-smoke/requests/library/contacts';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';

function deleteContact(contactName: string) {
  cy.contains('tbody tr', contactName, { timeout: 15000 }).should('be.visible');
  PageUtils.clickKababItem(contactName, 'Delete');
  PageUtils.clickButton('Confirm');
  cy.wait('@deleteContact');
  cy.contains('tbody tr', contactName, { timeout: 15000 }).should('not.exist');
  cy.wait('@contactsGone');
}

function restoreContact(contactName: string) {
  cy.intercept('POST', '**api/v1/contacts-deleted/restore/**').as('restoreContact');
  cy.intercept('GET', '**/api/v1/contacts-deleted/?page=**').as('getDeletedContacts');
  cy.contains('tbody tr', contactName, { timeout: 15000 })
    .should('be.visible')
    .find('.p-checkbox-input')
    .check({ force: true });
  cy.contains('button,a', 'Restore selected').click();
  cy.wait('@restoreContact');
  cy.wait('@getDeletedContacts');
  cy.contains('tbody tr', contactName, { timeout: 15000 }).should('not.exist');
}

describe('Contacts Soft and Hard Delete (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
    cy.intercept('GET', `**/api/v1/contacts/**page_size=**`).as(`getContactsList`);
  });

  /**
   * creates three contacts, soft deletes two, verifies Restore deleted contacts button,
   * doubly verifies the deletion of two contacts, restores one deleted contact
   * returns to Contact List, verifies un-deleted contact and restored contact are in list
   * verifies Restore deleted contacts button
   */
  it('part1', () => {
    const contacts: MockContact[] = [Individual_A_A, Individual_A_A, Individual_A_A];
    cy.contains('button,a', 'Add contact').should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts')
      .should('not.exist');
    for (const [i, contact] of contacts.entries()) {
      makeContact({
        ...contact,
        last_name: `${contact.last_name}${i}`,
        first_name: `${contact.first_name}${i}`,
      });
    }
    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.wait('@getContactsList');  
    const contactDisplayNames = contacts.map(
      (contact, i) => `${contact.last_name}${i}, ${contact.first_name}${i}`,
    );
    const contactToDelete = contactDisplayNames[0];
    const contactToRestore = contactDisplayNames[1];
    const contactToPreserve = contactDisplayNames[2];
    cy.intercept('DELETE', '**/api/v1/contacts/**').as('deleteContact');
    cy.intercept('GET', '**/api/v1/contacts-deleted/?page=1&ordering=name**').as('contactsGone');
    deleteContact(contactToDelete);
    deleteContact(contactToRestore);
    cy.intercept('GET', '**/api/v1/contacts-deleted/?page=1&ordering=sort_name**').as('getDeletedContacts');
    cy.contains('button,a', 'Restore deleted contacts')
      .should('be.visible')
      .click();
    cy.wait('@getDeletedContacts');
    cy.contains('h1', 'Restore deleted contacts').should('be.visible');
    cy.contains('tbody tr', contactToDelete, { timeout: 15000 }).should('be.visible');
    cy.contains('tbody tr', contactToRestore, { timeout: 15000 }).should('be.visible');
    cy.contains('tbody tr', contactToPreserve, { timeout: 15000 }).should('not.exist');
    restoreContact(contactToRestore);
    cy.contains('tbody tr', contactToRestore, { timeout: 15000 }).should('not.exist');
    ContactListPage.goToPage();
    cy.wait('@getContactsList');
    cy.contains('tbody tr', contactToPreserve, { timeout: 15000 }).should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts').should('be.visible');
  });

  /**
   * triggers beforeEach--> Initialize--> deleteAllContacts()
   * verifies Restore deleted contacts button is not visible and contacts table is empty
   */
  it('part2', () => {
    cy.contains('button,a', 'Restore deleted contacts')
      .should('not.exist');
    cy.contains('.empty-message', 'No data available in table').should('exist');
    cy.get('.paginator-text')
      .should('be.visible')
      .and('contain', 'Showing 0 to 0 of 0 contacts:');
  });
});
