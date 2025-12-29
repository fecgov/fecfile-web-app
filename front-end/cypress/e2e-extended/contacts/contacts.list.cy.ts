import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { ContactsHelpers } from './contacts.helpers';
import { SharedHelpers } from '../utils/shared.helpers';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { defaultFormData as contactFormData } from '../../e2e-smoke/models/ContactFormModel';
import { makeContact } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, MockContact } from '../../e2e-smoke/requests/library/contacts';

describe('Contacts List (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('shows header, table, Add, and correct column headers (empty state)', () => {
    cy.contains('h1', 'Manage contacts').should('exist');
    cy.get('p-table table, table').first().should('exist');
    cy.contains('button,a', 'Add contact').should('exist');
    // restore button is conditional; covered in delete tests
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
    cy.get('tbody tr').should('have.length.greaterThan', 3);
    const individualDisplayName = `${individualFormData['last_name']}, ${individualFormData['first_name']}`;
    const candidateDisplayName = `${candidateFormData['last_name']}, ${candidateFormData['first_name']}`;
    ContactsHelpers.assertRowValues(individualDisplayName, 'Individual');
    ContactsHelpers.assertRowValues(candidateDisplayName, 'Candidate', candidateId);
    ContactsHelpers.assertRowValues(committeeName, 'Committee');
    ContactsHelpers.assertRowValues(organizationName, 'Organization');
  });

  it('checks pagination controls empty state', () => {
    cy.contains(/results\s*per\s*page:/i).should('exist');
    SharedHelpers.openResultsPerPage();
    for (const size of SharedHelpers.RESULTS_PER_PAGE_SIZES) {
      cy.contains('[role="option"], .p-select-option', String(size)).should('exist');
    }

    PageUtils.blurActiveField();
    cy.contains(/showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+contacts?/i).should('exist');
    SharedHelpers.paginator().should('exist');
    ContactsHelpers.assertDisabled('button[aria-label="First Page"], .p-paginator-first');
    ContactsHelpers.assertDisabled('button[aria-label="Previous Page"], .p-paginator-prev');
    ContactsHelpers.assertDisabled('button[aria-label="Next Page"], .p-paginator-next');
    ContactsHelpers.assertDisabled('button[aria-label="Last Page"], .p-paginator-last');
  });

  it('supports results-per-page options 5, 10, 15, and 20 with correct pagination', () => {
    const total = 21;
    const base: MockContact = Individual_A_A;

    // Seed 21 contacts
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
    const pageTextRx = (start: number, end: number) =>
      new RegExp(
        String.raw`showing\s+${start}\s+to\s+${end}\s+of\s+${total}\s+contacts:?`,
        'i',
      );

    SharedHelpers.openResultsPerPage();
    for (const size of SharedHelpers.RESULTS_PER_PAGE_SIZES) {
      cy.contains('[role="option"], .p-select-option', String(size)).should('exist');
    }
    cy.get('body').click(0, 0);

    const selectPageSize = (size: number) => {
      SharedHelpers.chooseResultsPerPage(size);
      cy.contains(/results\s*per\s*page/i)
        .parent()
        .find('p-select [data-pc-section="label"], p-select .p-select-label')
        .filter(':visible')
        .first()
        .should('contain.text', String(size));
    };

    for (const size of SharedHelpers.RESULTS_PER_PAGE_SIZES) {
      cy.log(`Testing Results per page = ${size}`);
      selectPageSize(size);
      const expectedFirstPageRows = Math.min(size, total);
      cy.contains(pageTextRx(1, expectedFirstPageRows), { timeout: 15000 }).should('be.visible');
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
