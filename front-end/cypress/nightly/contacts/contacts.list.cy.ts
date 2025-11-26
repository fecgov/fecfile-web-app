import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { ContactsHelpers } from './contacts.helpers';
import { PageUtils } from '../../e2e/pages/pageUtils';
import { defaultFormData as contactFormData } from '../../e2e/models/ContactFormModel';
import { makeContact } from '../../e2e/requests/methods';
import { Individual_A_A, MockContact } from '../../e2e/requests/library/contacts';

describe('Contacts List (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('shows header, table, Add, and correct column headers (empty state)', () => {
    cy.contains('h1', 'Manage contacts').should('exist');
    cy.get('p-table table, table').first().should('exist');
    cy.contains('button,a', 'Add contact').should('exist');
    // will check for restore button, see populated test
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('.empty-message', 'No data available in table').should('exist');
  });

  it('renders a populated list with correct columns after creating contacts via UI', () => {
    const uid = Cypress._.random(1000, 9999);

    // Individual
    PageUtils.clickButton('Add contact');
    const individualFormData = {
      ...contactFormData,
      last_name: `IndLn${uid}`,
      first_name: `IndFn${uid}`,
    };
    ContactListPage.enterFormData(individualFormData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Candidate
    PageUtils.clickButton('Add contact');
    const candidateId = 'H0VA00001';
    const candidateFormData = {
      ...contactFormData,
      contact_type: 'Candidate',
      candidate_id: candidateId,
      candidate_office: 'House',
      candidate_state: 'Virginia',
      candidate_district: '01',
      last_name: `CandLn${uid}`,
      first_name: `CandFn${uid}`,
    };
    ContactListPage.enterFormData(candidateFormData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Committee 
    PageUtils.clickButton('Add contact');
    const committeeName = `Committee ${uid}`;
    const committeeFormData = {
      ...contactFormData,
      contact_type: 'Committee',
      name: committeeName,
    };
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Organization 
    PageUtils.clickButton('Add contact');
    const organizationName = `Organization ${uid}`;
    const organizationFormData = {
      ...contactFormData,
      contact_type: 'Organization',
      name: organizationName,
    };
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('button,a', 'Restore deleted contacts').should('exist');
    cy.get('tbody tr').should('have.length.greaterThan', 3);

    const individualDisplayName = `${individualFormData['last_name']}, ${individualFormData['first_name']}`;
    const candidateDisplayName = `${candidateFormData['last_name']}, ${candidateFormData['first_name']}`;
    ContactsHelpers.assertRowValues(individualDisplayName, 'Individual');
    ContactsHelpers.assertRowValues(candidateDisplayName, 'Candidate', candidateId);
    ContactsHelpers.assertRowValues(committeeName, 'Committee');
    ContactsHelpers.assertRowValues(organizationName, 'Organization');
  });

  it('checks pagination controls empty state', () => {
    const paginator = () => cy.get('p-paginator, .p-paginator').first();

    cy.contains(/results\s*per\s*page:/i).should('exist');
    cy.get('.p-select-dropdown').click().then(() => {
      cy.contains('.p-select-option', '5').should('exist');
      cy.contains('.p-select-option', '10').should('exist');
      cy.contains('.p-select-option', '15').should('exist');
      cy.contains('.p-select-option', '20').should('exist');
    });
    cy.contains(/showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+contacts?/i).should('exist');
    paginator().should('exist');

    ContactsHelpers.assertDisabled('button[aria-label="First Page"], .p-paginator-first');
    ContactsHelpers.assertDisabled('button[aria-label="Previous Page"], .p-paginator-prev');
    ContactsHelpers.assertDisabled('button[aria-label="Next Page"], .p-paginator-next');
    ContactsHelpers.assertDisabled('button[aria-label="Last Page"], .p-paginator-last');
  });

  it('supports results-per-page options 5, 10, 15, and 20 with correct pagination', () => {
    const total = 21;
    const base: MockContact = Individual_A_A;
    cy.then(() => {
      for (let i = 1; i <= total; i++) {
        makeContact({
          ...base,
          last_name: `${base.last_name}${i}`,
          first_name: `${base.first_name}${i}`,
        });
      }
    });

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains(/results\s*per\s*page:/i)
      .parent()
      .within(() => {
        cy.get('.p-select-dropdown').click();
      });

    cy.get('.p-select-option').should('have.length.at.least', 4);
    cy.get('.p-select-option').eq(0).should('contain.text', '5');
    cy.get('.p-select-option').eq(1).should('contain.text', '10');
    cy.get('.p-select-option').eq(2).should('contain.text', '15');
    cy.get('.p-select-option').eq(3).should('contain.text', '20');
    cy.get('body').click();

    const pageSizes = [
      { size: 5, index: 0 },
      { size: 10, index: 1 },
      { size: 15, index: 2 },
      { size: 20, index: 3 },
    ] as const;

    const pageTextRx = (start: number, end: number) =>
      new RegExp(
        `showing\\s+${start}\\s*(?:-|to)\\s*${end}\\s+of\\s+${total}\\s+contacts:?`,
        'i',
      );

    const openPageSizeDropdown = () => {
      cy.contains(/results\s*per\s*page:/i)
        .parent()
        .within(() => {
          cy.get('.p-select-dropdown').scrollIntoView().click({ force: true });
        });
    };

    for (const { size, index } of pageSizes) {
      cy.log(`Testing Results per page = ${size}`);
      openPageSizeDropdown();
      cy.get('.p-select-option')
        .eq(index)
        .should('be.visible')
        .click({ force: true });

      const expectedFirstPageRows = Math.min(size, total);
      cy.contains(pageTextRx(1, expectedFirstPageRows), { timeout: 15000 }).should('exist');
      cy.get('tbody tr').should('have.length', expectedFirstPageRows);
      if (size === 20) {
        cy.get('button[aria-label="Next Page"], .p-paginator-next')
          .first()
          .should('not.be.disabled')
          .click({ force: true });

        cy.contains(pageTextRx(21, 21), { timeout: 15000 }).should('be.visible');
        cy.get('tbody tr').should('have.length', 1);
      }

      cy.get('.p-paginator').should('exist');
    }
  });
});
