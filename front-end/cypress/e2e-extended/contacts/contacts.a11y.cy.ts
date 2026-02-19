import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsDeleteHelpers, ContactsHelpers } from './contacts.helpers';
import { makeContact, makeTransaction } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, Organization_A, MockContact } from '../../e2e-smoke/requests/library/contacts';
import { buildScheduleA } from '../../e2e-smoke/requests/library/transactions';
import { SmokeAliases } from '../../e2e-smoke/utils/aliases';

// A11Y WAIVERS (must include link)
const WAIVERS: Record<string, { reason: string; link: string }> = {};

/*
  What we scan and why:
  - Contacts list: scope to the p-table containing the "Manage contacts" heading, in a populated state so row/actions render
    (Empty-state DOM is covered in contacts.list.cy.ts; add a scan here if that state changes)
  - Add/Edit dialogs: scope to the visible PrimeNG dialog (.p-dialog:visible) used throughout contacts tests/helpers
  - Deleted contacts: scope to the Restore deleted contacts table container returned by ContactsDeleteHelpers
  - Restored contacts: scope to the Restore deleted contacts button being visible after deleting a contact
  - Transaction history: scope to the app-table titled "Transaction history" inside the Edit Contact dialog

  How to update selectors if UI changes:
  - If the Manage contacts table is no longer under a p-table with the heading, update getContactsTableContainer()
  - If dialogs change away from .p-dialog, update ContactsHelpers.DIALOG and dialog queries here
  - If the deleted contacts view changes (route/table wrapper), update getRestoreDeletedContactsDialog() usage
  - If the transaction history table markup changes, update the app-table[itemname="transactions"] selector
*/

const CONTACTS_A11Y_ALIAS_SOURCE = 'extendedContactsA11y';
const CONTACTS_LIST_ALIAS = SmokeAliases.network.named(
  'GetContactsList',
  CONTACTS_A11Y_ALIAS_SOURCE,
);
const DELETE_CONTACT_ALIAS = SmokeAliases.network.named(
  'DeleteContact',
  CONTACTS_A11Y_ALIAS_SOURCE,
);
const CONTACTS_GONE_ALIAS = SmokeAliases.network.named(
  'GetDeletedContacts',
  CONTACTS_A11Y_ALIAS_SOURCE,
);
const GET_TRANSACTION_HISTORY_ALIAS = SmokeAliases.network.named(
  'GetTransactionHistory',
  CONTACTS_A11Y_ALIAS_SOURCE,
);
const CONTACTS_LIST_ENDPOINT = '**/api/v1/contacts/**page_size=**';

const visitContactsList = () => {
  cy.intercept({
    method: 'GET',
    url: CONTACTS_LIST_ENDPOINT,
    times: 5,
  }).as(CONTACTS_LIST_ALIAS);
  ContactListPage.goToPage();
  cy.wait(`@${CONTACTS_LIST_ALIAS}`);
  ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
};

const getContactsTableContainer = () =>
  cy.contains('h1', 'Manage contacts')
    .should('be.visible')
    .closest('p-table')
    .should('exist');

const checkCritical = ($el: JQuery<HTMLElement>) => {
  cy.checkA11yCritical($el, undefined, WAIVERS);
};

describe('Contacts - axe smoke (critical)', () => {
  beforeEach(() => {
    Initialize();
  });

  it('Contacts list page - table view', () => {
    const lastName = 'A11yList';
    const firstName = 'Contact';
    const contact: MockContact = {
      ...Individual_A_A,
      last_name: lastName,
      first_name: firstName,
    };
    const displayName = `${lastName}, ${firstName}`;
    makeContact(contact);
    visitContactsList();
    cy.contains('tbody tr', displayName).should('be.visible');
    getContactsTableContainer().then(checkCritical);
  });

  it('Add Contact dialog', () => {
    visitContactsList();
    PageUtils.clickButton('Add contact');
    cy.get(ContactsHelpers.DIALOG).should('be.visible').then(checkCritical);
    cy.get(ContactsHelpers.DIALOG)
      .contains('button', /^Cancel$/)
      .should('be.visible')
      .focus()
      .type('{enter}');
    cy.get(ContactsHelpers.DIALOG).should('not.exist');
  });

  it('Edit Contact dialog', () => {
    const lastName = 'A11yEdit';
    const firstName = 'Contact';
    const contact: MockContact = {
      ...Individual_A_A,
      last_name: lastName,
      first_name: firstName,
    };
    const displayName = `${lastName}, ${firstName}`;
    makeContact(contact);
    visitContactsList();
    cy.contains('tbody tr', displayName)
      .should('be.visible')
      .within(() => {
        cy.get('app-table-actions-button button')
          .should('have.attr', 'aria-label')
          .then((label) => {
            const normalized = (typeof label === 'string' ? label : '').replaceAll(/\s+/g, ' ').trim();
            const expected = `edit ${displayName}`.replaceAll(/\s+/g, ' ').trim();
            expect(normalized.toLowerCase()).to.eq(expected.toLowerCase());
          });
      });
    PageUtils.clickKababItem(displayName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');
    cy.get(ContactsHelpers.DIALOG)
      .should('be.visible')
      .find('form#form')
      .should('exist')
      .then(checkCritical);

    PageUtils.clickButton('Cancel');
    cy.contains(/Edit Contact/i).should('not.exist');
  });

  it('Deleted contacts - table view', () => {
    const deletedName = 'A11y Deleted Contact';
    const contact: MockContact = {
      ...Organization_A,
      name: deletedName,
    };

    makeContact(contact);
    visitContactsList();
    cy.contains('button,a', 'Restore deleted contacts').should('not.exist');
    cy.intercept({
      method: 'DELETE',
      url: '**/api/v1/contacts/**',
      times: 5,
    }).as(DELETE_CONTACT_ALIAS);
    cy.intercept({
      method: 'GET',
      url: '**/api/v1/contacts-deleted/**',
      times: 5,
    }).as(CONTACTS_GONE_ALIAS);
    ContactsDeleteHelpers.deleteContact(deletedName, {
      deleteAlias: DELETE_CONTACT_ALIAS,
      contactsGoneAlias: CONTACTS_GONE_ALIAS,
    });
    cy.contains('button,a', 'Restore deleted contacts').should('be.visible');
    ContactsDeleteHelpers.openRestoreDeletedContactsModal();
    cy.wait(`@${CONTACTS_GONE_ALIAS}`);
    ContactsDeleteHelpers.getRestoreDeletedContactsDialog()
      .should('be.visible')
      .then(checkCritical);

    cy.contains('button', /^Back$/).should('be.visible').click({ force: true });
    cy.wait(`@${CONTACTS_LIST_ALIAS}`);
  });

  it('Transaction history - table view', () => {
    const lastName = 'A11yTxn';
    const firstName = 'Contact';
    const contact: MockContact = {
      ...Individual_A_A,
      last_name: lastName,
      first_name: firstName,
    };
    const displayName = `${lastName}, ${firstName}`;
    makeContact(contact, (contactResp) => {
      const created = contactResp.body;
      const dateStr = new Date().toISOString().slice(0, 10);
      const txn = buildScheduleA('INDIVIDUAL_RECEIPT', 123, dateStr, created, undefined, { report_ids: [] });
      makeTransaction(txn);
    });

    visitContactsList();
    cy.contains('tbody tr', displayName).should('be.visible');
    cy.intercept(
      'GET',
      '**/api/v1/transactions/?page=1&ordering=transaction_type_identifier&page_size=5&contact=*',
    ).as(GET_TRANSACTION_HISTORY_ALIAS);
    PageUtils.clickKababItem(displayName, 'Edit');
    cy.contains(/Edit Contact/i).should('exist');
    cy.wait(`@${GET_TRANSACTION_HISTORY_ALIAS}`);
    cy.get('app-table[itemname="transactions"]')
      .should('exist')
      .scrollIntoView({ offset: { top: -120, left: 0 } })
      .should('be.visible')
      .as('transactionHistoryTable');

    cy.get('@transactionHistoryTable').find('table').should('exist');
    cy.get('@transactionHistoryTable').then(checkCritical);
    PageUtils.clickButton('Cancel');
    cy.contains(/Edit Contact/i).should('not.exist');
  });
});
