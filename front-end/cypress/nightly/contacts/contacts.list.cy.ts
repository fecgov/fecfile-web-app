import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { ContactsHelpers } from './contacts.helpers';
import { PageUtils } from '../../e2e/pages/pageUtils';
import { defaultFormData as contactFormData } from '../../e2e/models/ContactFormModel';


describe('Contacts List (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('shows header, table, Add and Restore, and correct column headers (empty state)', () => {
    cy.contains('h1', 'Manage contacts').should('exist');
    cy.get('p-table table, table').first().should('exist');
    cy.contains('button,a', 'Add contact').should('exist');
    cy.contains('button,a', 'Restore deleted contacts').should('exist');
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('.empty-message', 'No data available in table').should('exist');
  });

  it('renders a populated list with correct columns after creating contacts via UI', () => {
    const uid = Cypress._.random(1000, 9999);
    const makeContact = (overrides: Record<string, any>) => {
      const formData = { ...contactFormData, ...overrides };
      PageUtils.clickButton('Add contact');
      ContactListPage.enterFormData(formData);
      PageUtils.clickButton('Save');
      cy.contains('Save').should('not.exist');
    };

    const indFirst = `Ind${uid}`;
    const indLast = `Ln${uid}`;
    const indDisplay = `${indLast}, ${indFirst}`;
    makeContact({
      contact_type: 'Individual',
      first_name: indFirst,
      last_name: indLast,
      street_1: '123 Main St',
      city: 'Reston',
      state: 'Virginia',
      zip: '20190',
      employer: 'Acme',
      occupation: 'QA',
      telephone: '5551234567',
    });

    const committeeName = `Comm${uid}`;
    const committeeId = `C${String(uid).padStart(8, '0')}`;
    makeContact({
      contact_type: 'Committee',
      name: committeeName,
      committee_id: committeeId,
      street_1: '10 Elm Rd',
      city: 'Alexandria',
      state: 'Virginia',
      zip: '22314',
      telephone: '5551112222',
    });

    const candFirst = `Cand${uid}`;
    const candLast = `Ln${uid}`;
    const candDisplay = `${candLast}, ${candFirst}`;
    const candidateId = 'H0VA00001';
    makeContact({
      contact_type: 'Candidate',
      candidate_id: candidateId,
      candidate_office: 'House',
      candidate_state: 'Virginia',
      candidate_district: '01',
      first_name: candFirst,
      last_name: candLast,
      street_1: '500 Pine Ave',
      city: 'Arlington',
      state: 'Virginia',
      zip: '22201',
      employer: 'Self',
      occupation: 'Candidate',
      telephone: '5559990000',
    });

    const orgName = `Org${uid}`;
    makeContact({
      contact_type: 'Organization',
      name: orgName,
      street_1: '77 Market St',
      city: 'Fairfax',
      state: 'Virginia',
      zip: '22030',
      telephone: '5557778888',
    });

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.get('tbody tr').should('have.length.greaterThan', 3);

    const assertRow = (needle: string, expectedType: string, expectedFecId?: string) => {
      cy.contains('tbody tr', needle, { matchCase: false })
        .should('exist')
        .within(() => {
          cy.get('td').eq(1).invoke('text').then(t => {
            expect(t.trim().toLowerCase()).to.eq(expectedType.toLowerCase());
          });
          if (expectedFecId) {
            cy.get('td').eq(2).invoke('text').then(t => {
              expect(t.replace(/\s+/g, '').toUpperCase()).to.eq(expectedFecId.toUpperCase());
            });
          }
        });
    };
    assertRow(indDisplay, 'Individual');
    assertRow(committeeName, 'Committee', committeeId);
    assertRow(candDisplay, 'Candidate', candidateId);
    assertRow(orgName, 'Organization');
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
    cy.intercept('GET', '**/api/v1/contacts**').as('getContacts');
    const makeContact = (overrides: Record<string, any>) => {
      const formData = { ...contactFormData, ...overrides };
      PageUtils.clickButton('Add contact');
      ContactListPage.enterFormData(formData);
      PageUtils.clickButton('Save');
      cy.contains('Save').should('not.exist');
    };

    for (let i = 1; i <= 21; i++) {
      makeContact({
        contact_type: 'Individual',
        last_name: `Last${i}`,
        first_name: `First${i}`,
      });
    }

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.get('.p-select-dropdown').should('exist').click();
    cy.contains('.p-select-option', '5').should('exist');
    cy.contains('.p-select-option', '10').should('exist');
    cy.contains('.p-select-option', '15').should('exist');
    cy.contains('.p-select-option', '20').should('exist');
    cy.get('body').click();

    const sizes = [5, 10, 15, 20] as const;

    for (const size of sizes) {
      cy.log(`Testing Results per page = ${size}`);
      cy.get('.p-select-dropdown').scrollIntoView().click({ force: true });
      cy.contains('.p-select-option', new RegExp(`^\\s*${size}\\s*$`))
        .should('be.visible')
        .click({ force: true });

      const rx = /showing\s+(\d+)\s*(?:-|to)\s*(\d+)\s+of\s+21\s+contacts?/i;
      cy.contains(rx).should(($el) => {
        const text = ($el as unknown as JQuery<HTMLElement>).text();
        const m = text.match(rx);
        expect(m, `could not parse page report from "${text}"`).to.not.be.null;
        const start = Number(m![1]);
        const end = Number(m![2]);
        const expectedRows = Math.max(0, end - start + 1);
        expect(expectedRows, 'rows per page (from report)').to.be.within(1, size);
      });

      cy.contains(rx).invoke('text').then((text) => {
        const m = text.match(rx)!;
        const start = Number(m[1]);
        const end = Number(m[2]);
        const expectedRows = Math.max(0, end - start + 1);
        cy.get('tbody tr').should('have.length', expectedRows);
      });
      cy.get('.p-paginator').should('exist');
    }
  });
});