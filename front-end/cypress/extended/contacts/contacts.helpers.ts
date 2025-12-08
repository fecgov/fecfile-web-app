
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactFormData } from '../../e2e-smoke/models/ContactFormModel';

type ContactCaseType = ContactFormData['contact_type'];
type ContactCaseConfig = {
  label: string;
  overrides: Partial<ContactFormData>;
  rowText: string;
  type: ContactCaseType;
  fecId?: string;
};

export class ContactsHelpers {
  static CONTACTS_HEADERS = [
    'Name',
    'Type',
    'FEC ID',
    'Employer',
    'Occupation',
    'Actions',
  ] as const;

  static assertColumnHeaders(
    expected: readonly string[] = this.CONTACTS_HEADERS
  ): void {
    cy.get('p-table table thead th, table thead th')
      .then(($ths) =>
        Array.from($ths, (th) =>
          (th.textContent || '').trim().replace(/\s+/g, ' ')
        )
      )
      .should('deep.equal', [...expected]);
  }

  static assertDisabled(selector: string) {
    cy.get(selector)
      .first()
      .should('exist')
      .should(($el) => {
        const disabled =
          $el.is(':disabled') ||
          $el.hasClass('p-disabled') ||
          $el.attr('aria-disabled') === 'true';
        expect(disabled, `${selector} should be disabled`).to.eq(true);
      });
  }

  static assertEnabled(selector: string) {
    cy.get(selector)
      .first()
      .should('exist')
      .should(($el) => {
        const disabled =
          $el.is(':disabled') ||
          $el.hasClass('p-disabled') ||
          $el.attr('aria-disabled') === 'true';
        expect(disabled, `${selector} should be enabled`).to.eq(false);
      });
  }

  // contacts.helpers.ts
  static selectResultsPerPage(n: number) {
    cy.contains(/results\s*per\s*page:/i)
      .parent()
      .within(() => {
        cy.get('.p-select-dropdown')
          .first()
          .scrollIntoView()
          .click();
      });

    const optionRegex = new RegExp(`^\\s*${n}\\s*$`);
    cy.get('body')
      .find('.p-select-list')
      .should('be.visible')
      .last()
      .within(() => {
        cy.contains('.p-select-option', optionRegex)
          .should('be.visible')
          .click();
      });
  }

  static assertPageReport(start: number, end: number, total: number) {
    const rx = new RegExp(
      `showing\\s+${start}\\s*(?:-|to)\\s*${end}\\s+of\\s+${total}\\s+contacts?`,
      'i'
    );
    cy.contains(rx).should('exist');
  }

  static assertSuccessToastMessage() {
    cy.contains('.p-toast-message, .p-toast', /(success|saved|created)/i, {
      timeout: 10000,
    }).should('exist');
  };

  static assertRowValues(rowText: string, expectedType: string, expectedFecId?: string) {
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
              expect(t.replaceAll(/\s+/g, '').toUpperCase()).to.eq(expectedFecId.toUpperCase());
            });
        }
      });
  };

  static buildContactTypeCases(uid: number): ContactCaseConfig[] {
    const individualLast = `IndLn${uid}`;
    const individualFirst = `IndFn${uid}`;
    const individualDisplay = `${individualLast}, ${individualFirst}`;

    const candidateLast = `CandLn${uid}`;
    const candidateFirst = `CandFn${uid}`;
    const candidateId = 'H0VA00001';

    const committeeName = `Committee ${uid}`;
    const committeeId = `C${String(uid).padStart(8, '0')}`;

    const orgName = `Organization ${uid}`;

    return [
      {
        label: 'Individual',
        overrides: {
          contact_type: 'Individual',
          last_name: individualLast,
          first_name: individualFirst,
        },
        rowText: individualDisplay,
        type: 'Individual',
      },
      {
        label: 'Candidate',
        overrides: {
          contact_type: 'Candidate',
          last_name: candidateLast,
          first_name: candidateFirst,
          candidate_id: candidateId,
          candidate_office: 'House',
          candidate_state: 'Virginia',
          candidate_district: '01',
        },
        rowText: candidateId,
        type: 'Candidate',
        fecId: candidateId,
      },
      {
        label: 'Committee',
        overrides: {
          contact_type: 'Committee',
          name: committeeName,
          committee_id: committeeId,
        },
        rowText: committeeId,
        type: 'Committee',
        fecId: committeeId,
      },
      {
        label: 'Organization',
        overrides: {
          contact_type: 'Organization',
          name: orgName,
        },
        rowText: orgName,
        type: 'Organization',
      },
    ];
  }

  static createContactViaLookup(
    entityLabel: 'Committee' | 'Candidate',
    searchEndpoint: string,
    rowMatch: RegExp,
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    PageUtils.clickButton('Add contact');
    cy.get('#entity_type_dropdown')
      .first()
      .click();

    cy.contains('.p-select-option', entityLabel)
      .scrollIntoView({ offset: { top: 0, left: 0 } })
      .click();

    cy.intercept('GET', searchEndpoint).as('entitySearch');
    cy.get('.p-autocomplete-input')
      .should('exist')
      .type('ber');

    cy.get('.p-autocomplete-option')
      .should('have.length.at.least', 1)
      .first()
      .click({ force: true });

    cy.wait('@entitySearch');
    cy.intercept('POST', '**/api/v1/contacts/').as('createContact');
    PageUtils.clickButton('Save');
    cy.wait('@createContact');

    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    return cy.contains('tbody tr', rowMatch).should('exist');
  };
}
