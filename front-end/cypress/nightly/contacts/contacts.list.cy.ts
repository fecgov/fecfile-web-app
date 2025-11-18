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

  xit('shows header, table, Add, and correct column headers (empty state)', () => {
    cy.contains('h1', 'Manage contacts').should('exist');
    cy.get('p-table table, table').first().should('exist');
    cy.contains('button,a', 'Add contact').should('exist');
    // will check for restore button, see populated test
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('.empty-message', 'No data available in table').should('exist');
  });

  xit('renders a populated list with correct columns after creating contacts via UI', () => {
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

    const assertRow = (rowText: string, expectedType: string, expectedFecId?: string) => {
      cy.contains('tbody tr', rowText, { matchCase: false })
        .should('exist')
        .within(() => {
          cy.get('td')
            .eq(1)
            .invoke('text')
            .then((t) => {
              expect(t.trim().toLowerCase()).to.eq(expectedType.toLowerCase());
            });

          if (expectedFecId) {
            cy.get('td')
              .eq(2)
              .invoke('text')
              .then((t) => {
                expect(t.replace(/\s+/g, '').toUpperCase()).to.eq(expectedFecId.toUpperCase());
              });
          }
        });
    };

    const individualDisplayName = `${individualFormData['last_name']}, ${individualFormData['first_name']}`;
    const candidateDisplayName = `${candidateFormData['last_name']}, ${candidateFormData['first_name']}`;
    assertRow(individualDisplayName, 'Individual');
    assertRow(candidateDisplayName, 'Candidate', candidateId);
    assertRow(committeeName, 'Committee');
    assertRow(organizationName, 'Organization');
  });

  xit('checks pagination controls empty state', () => {
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
    cy.get('.p-select-option').contains(/^5$/).should('exist');
    cy.get('.p-select-option').contains(/^10$/).should('exist');
    cy.get('.p-select-option').contains(/^15$/).should('exist');
    cy.get('.p-select-option').contains(/^20$/).should('exist');
    cy.get('body').click();

    const sizes = [5, 10, 15, 20] as const;

    const pageTextRx = (start: number, end: number) =>
      new RegExp(
        `showing\\s+${start}\\s*(?:-|to)\\s*${end}\\s+of\\s+${total}\\s+contacts:?`,
        'i',
      );

    const selectPageSize = (size: number) => {
      cy.contains(/results\s*per\s*page:/i)
        .parent()
        .within(() => {
          cy.get('.p-select-dropdown').scrollIntoView().click({ force: true });
        });

      cy.get('.p-select-option')
        .contains(new RegExp(`^\\s*${size}\\s*$`))
        .scrollIntoView()
        .click({ force: true });
    };

    for (const size of sizes) {
      cy.log(`Testing Results per page = ${size}`);
      selectPageSize(size);
      const expectedFirstPageRows = Math.min(size, total);
      cy.contains(pageTextRx(1, expectedFirstPageRows), { timeout: 15000 }).should('exist');
      cy.get('tbody tr').should('have.length', expectedFirstPageRows);
      if (size === 20) {
        cy.get('button[aria-label="Next Page"], .p-paginator-next')
          .first()
          .should('not.be.disabled')
          .click({ force: true });

        cy.contains(pageTextRx(21, 21), { timeout: 15000 }).should('exist');
        cy.get('tbody tr').should('have.length', 1);
      }
      cy.get('.p-paginator').should('exist');
    }
  });
});
