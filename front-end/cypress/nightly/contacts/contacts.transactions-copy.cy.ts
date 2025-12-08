import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { PageUtils } from '../../e2e/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';

describe('Contacts ↔ Transactions integration', () => {
  const uniqueSuffix = Date.now();

  const newContact = {
    type: 'Individual',
    lastName: `TxnLast${uniqueSuffix}`,
    firstName: `TxnFirst${uniqueSuffix}`,
    street: '123 Cypress St',
    city: 'Arlington',
    state: 'Virginia',
    zip: '22201',
  };

  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('newly created contact appears in transaction contact selector and validates', () => {
    cy.contains('button', 'Add contact', { matchCase: false }).click();

    // Contact type
    cy.contains('label', 'Contact type', { matchCase: false })
      .parent()
      .find('select, .p-dropdown, [role="combobox"]')
      .click();

    cy.contains('[role="option"], li, .p-dropdown-item', newContact.type).click();

    // Name fields
    cy.contains('label', 'Last name', { matchCase: false })
      .parent()
      .find('input')
      .clear()
      .type(newContact.lastName);

    cy.contains('label', 'First name', { matchCase: false })
      .parent()
      .find('input')
      .clear()
      .type(newContact.firstName);

    // Address
    cy.contains('label', 'Street address', { matchCase: false })
      .parent()
      .find('input, textarea')
      .clear()
      .type(newContact.street);

    cy.contains('label', /^City$/i)
      .parent()
      .find('input')
      .clear()
      .type(newContact.city);

    cy.contains('label', /State\/Territory/i)
      .parent()
      .find('select, .p-dropdown, [role="combobox"]')
      .click();

    cy.contains('[role="option"], li, .p-dropdown-item', newContact.state).click();

    cy.contains('label', /ZIP\/Postal code/i)
      .parent()
      .find('input')
      .clear()
      .type(newContact.zip);

    cy.contains('button', 'Save', { matchCase: false }).click();

    const expectedDisplayName = `${newContact.lastName}, ${newContact.firstName}`;

    cy.contains('h1, h2', 'Manage contacts', { matchCase: false }).should('exist');
    cy.contains('table tbody tr', expectedDisplayName).should('exist');

    //
    // 2. Navigate to a transaction form (no hard reload)
    //
    cy.contains('a, button', /^Reports$/i).click();
    cy.contains('a, button', /Manage reports/i).click();

    cy.get('table tbody tr')
      .first()
      .within(() => {
        cy.contains('a, button', /View|Edit|Open/i).click();
      });

    cy.contains('a, button', /Transactions/i).click();

    cy.contains('button, a', /Add transaction/i).click();
    cy.contains('button, a', /Contribution from individual/i).click();

    //
    // 3. Pick the new contact in the selector
    //
    cy.contains('label', /Contact|Contributor|Name/i)
      .parent()
      .within(() => {
        cy.get('input, [role="combobox"]').click().type(newContact.lastName);
      });

    cy.contains('[role="option"], .p-autocomplete-item, li', expectedDisplayName)
      .click();

    cy.contains(/contact.*required/i).should('not.exist');

    //
    // 4. Complete minimal valid transaction and save
    //
    cy.contains('label', /^Date$/i)
      .parent()
      .find('input')
      .clear()
      .type('01/01/2026');

    cy.contains('label', /^Amount$/i)
      .parent()
      .find('input')
      .clear()
      .type('10.00');

    cy.contains('button', /^Save$/i).click();

    cy.contains('table tbody tr', expectedDisplayName).should('exist');
  });
});
