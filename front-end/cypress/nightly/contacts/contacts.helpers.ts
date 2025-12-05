
import { PageUtils } from '../../e2e/pages/pageUtils';

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

  static selectResultsPerPage(n: number) {
    cy.contains(/results\s*per\s*page:/i).should('exist');
    cy.contains(/results\s*per\s*page:/i)
      .parent()
      .within(() => {
        cy.get('.p-select')
          .then(($sel) => {
            if ($sel.length) {
              cy.wrap($sel).select(String(n), { force: true });
            } else {
              cy.get('.p-select-dropdown').first().click({ force: true });
              cy.get('.p-select-option')
                .contains(new RegExp(`^\\s*${n}\\s*$`))
                .click({ force: true });
            }
          });
      });

    cy.get('tbody tr').should('exist');
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
  }

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
  }

  static confirmContactEdit(
    displayName?: string,
    changeMatchers: Array<string | RegExp> = []
  ): void {
    // Modal header
    cy.contains('div', /^\s*Confirm\s*$/i).should('exist');

    // Main explanatory line
    if (displayName) {
      cy.contains(
        `Your suggested changes for ${displayName} will affect all transactions involving this contact.`
      ).should('exist');
    } else {
      cy.contains(/will affect all transactions involving this contact/i).should(
        'exist'
      );
    }

    // Optionally assert individual “Updated X to Y” lines
    changeMatchers.forEach((matcher) => {
      cy.contains(matcher).should('exist');
    });

    // Click Continue
    PageUtils.clickButton('Continue');
  }
}
