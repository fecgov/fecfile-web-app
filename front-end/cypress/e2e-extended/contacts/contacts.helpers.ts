import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactFormData } from '../../e2e-smoke/models/ContactFormModel';
import type { MockContact } from '../../e2e-smoke/requests/library/contacts';
import { buildScheduleA } from '../../e2e-smoke/requests/library/transactions';
import type { F3X } from '../../e2e-smoke/requests/library/reports';
import type { Contact } from '../../../src/app/shared/models';

type ContactCaseType = ContactFormData['contact_type'];
type ContactCaseConfig = {
  label: string;
  overrides: Partial<ContactFormData>;
  rowText: string;
  type: ContactCaseType;
  fecId?: string;
};

export class ContactsHelpers {
  static readonly CONTACTS_HEADERS = [
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
          (th.textContent || '').trim().replaceAll(/\s+/g, ' ')
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

    const optionRegex = new RegExp(String.raw`^\s*${n}\s*$`);
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
      String.raw`showing\s+${start}\s*(?:-|to)\s*${end}\s+of\s+${total}\s+contacts?`,
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
    const searchTerm = 'ber';
    const candidateId = 'H0VA00001';
    const committeeId = 'C00000001';
    const candidateName = 'Beryl Candidate';
    const committeeName = 'Beryl Committee';
    const lookupEndpoint =
      entityLabel === 'Candidate'
        ? '**/api/v1/contacts/candidate_lookup/**'
        : '**/api/v1/contacts/committee_lookup/**';

    if (entityLabel === 'Candidate') {
      cy.intercept('GET', lookupEndpoint, {
        statusCode: 200,
        body: {
          fec_api_candidates: [
            {
              candidate_id: candidateId,
              name: candidateName,
              office: 'H',
            },
          ],
          fecfile_candidates: [],
        },
      }).as('entityLookup');

      cy.intercept('GET', searchEndpoint, {
        statusCode: 200,
        body: {
          candidate_id: candidateId,
          name: candidateName,
          candidate_first_name: 'Beryl',
          candidate_last_name: 'Candidate',
          candidate_middle_name: 'Q',
          candidate_prefix: 'Ms.',
          candidate_suffix: '',
          address_street_1: '123 Main St',
          address_street_2: '',
          address_city: 'Richmond',
          address_state: 'VA',
          address_zip: '23219',
          office: 'H',
          state: 'VA',
          district: '01',
        },
      }).as('entityDetails');
    } else {
      cy.intercept('GET', lookupEndpoint, {
        statusCode: 200,
        body: {
          fec_api_committees: [
            {
              id: committeeId,
              name: committeeName,
              is_active: true,
            },
          ],
          fecfile_committees: [],
        },
      }).as('entityLookup');

      cy.intercept('GET', searchEndpoint, {
        statusCode: 200,
        body: {
          committee_id: committeeId,
          name: committeeName,
          street_1: '456 Main St',
          street_2: '',
          city: 'Richmond',
          state: 'VA',
          zip: '23219',
          treasurer_phone: '5555551234',
        },
      }).as('entityDetails');
    }

    PageUtils.clickButton('Add contact');
    cy.get('#entity_type_dropdown')
      .first()
      .click();

    cy.contains('.p-select-option', entityLabel)
      .scrollIntoView({ offset: { top: 0, left: 0 } })
      .click();

    cy.get('.p-autocomplete-input')
      .should('exist')
      .type(searchTerm);

    cy.wait('@entityLookup');
    cy.get('body')
      .find('.p-autocomplete-option')
      .should('have.length.at.least', 1)
      .first()
      .click({ force: true });

    cy.wait('@entityDetails');
    cy.intercept('POST', '**/api/v1/contacts/').as('createContact');
    PageUtils.clickButton('Save');
    cy.wait('@createContact');

    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    return cy.contains('tbody tr', rowMatch).should('exist');
  };
}

const CONFIRM_DELETE_TEXT = /Are you sure you want to delete this item\?/i;

export class ContactsDeleteHelpers {
  static requestWithCookies<T = unknown>(
    method: string,
    url: string,
    body?: Cypress.RequestBody,
    options: Partial<Cypress.RequestOptions> = {},
  ): Cypress.Chainable<Cypress.Response<T>> {
    return cy.getAllCookies().then((cookies: Cypress.Cookie[]) => {
      const cookieObj: Record<string, string> = {};
      cookies.forEach((cookie) => {
        cookieObj[cookie.name] = cookie.value;
      });

      const cookieHeader = Object.entries(cookieObj)
        .map(([name, value]) => `${name}=${value}`)
        .join('; ');
      const headers: Record<string, string> = { Cookie: cookieHeader };
      const csrfToken = cookieObj['csrftoken'];
      if (csrfToken) {
        headers['x-csrftoken'] = csrfToken;
      }

      return cy.request<T>({
        method,
        url,
        body,
        headers,
        ...options,
      });
    });
  }

  static createContact(contact: MockContact): Cypress.Chainable<Contact> {
    return ContactsDeleteHelpers.requestWithCookies<Contact>(
      'POST',
      'http://localhost:8080/api/v1/contacts/',
      contact,
    ).then((response) => response.body);
  }

  static createReport(report: F3X): Cypress.Chainable<string> {
    return ContactsDeleteHelpers.requestWithCookies<{ id: string }>(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      report,
    ).then((response) => response.body.id);
  }

  static createLinkedTransaction(
    contact: Contact,
    reportId: string,
    transactionDate: string,
  ): Cypress.Chainable<Cypress.Response<unknown>> {
    const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, transactionDate, contact, reportId);
    return ContactsDeleteHelpers.requestWithCookies(
      'POST',
      'http://localhost:8080/api/v1/transactions/',
      transaction,
    );
  }

  static seedContactsWithLinkedTransaction(options: {
    unlinkedContact: MockContact;
    linkedContact: MockContact;
    report: F3X;
    transactionDate: string;
  }): Cypress.Chainable<Cypress.Response<unknown>> {
    const { unlinkedContact, linkedContact, report, transactionDate } = options;
    return ContactsDeleteHelpers.createContact(unlinkedContact)
      .then(() => ContactsDeleteHelpers.createContact(linkedContact))
      .then((linked) =>
        ContactsDeleteHelpers.createReport(report).then((reportId) =>
          ContactsDeleteHelpers.createLinkedTransaction(linked, reportId, transactionDate),
        ),
      );
  }

  static isDisabled($el: JQuery<HTMLElement>) {
    return $el.is(':disabled') || $el.hasClass('p-disabled') || $el.attr('aria-disabled') === 'true';
  }

  static getDialogByText(text: RegExp) {
    return cy.contains('dialog, [role="dialog"], .p-dialog', text).should('be.visible');
  }

  static getConfirmDeleteDialog() {
    return ContactsDeleteHelpers.getDialogByText(CONFIRM_DELETE_TEXT);
  }

  static clickConfirmDeleteModalButton(label: 'Cancel' | 'Confirm' | 'No' | 'Close') {
    const normalized = label === 'No' ? 'Cancel' : label;
    return ContactsDeleteHelpers.getConfirmDeleteDialog().then(($dialog) => {
      if (normalized === 'Close') {
        const $close = $dialog.find('[aria-label="Cancel"]').first();
        if ($close.length) {
          return cy.wrap($close).click({ force: true });
        }
        throw new Error('Confirm delete dialog close icon not found.');
      }

      const $button = $dialog
        .find('button')
        .filter((_, el) => (el.textContent || '').trim() === normalized)
        .first();
      if ($button.length) {
        return cy.wrap($button).click({ force: true });
      }
      if (normalized === 'Cancel') {
        const $close = $dialog.find('[aria-label="Cancel"]').first();
        if ($close.length) {
          return cy.wrap($close).click({ force: true });
        }
      }
      throw new Error(`Confirm delete dialog "${normalized}" button not found.`);
    });
  }

  static getRestoreDeletedContactsDialog() {
    return ContactsDeleteHelpers.getDialogByText(/Restore deleted contacts/i);
  }

  static getContactRow(contactName: string) {
    return cy.contains('tbody tr', contactName, { timeout: 15000 }).should('be.visible');
  }

  static openActionsMenu(contactName: string) {
    PageUtils.blurActiveField();
    PageUtils.getKabob(contactName);
    cy.get('.p-popover').filter(':visible').should('exist');
    cy.get('.p-popover').filter(':visible').contains('button', /Edit/i).should('be.visible');
  }

  static findActionButtonInOpenMenu(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('body').then(($body) => {
      const $button = $body
        .find('.p-popover:visible')
        .first()
        .find('button')
        .filter((_, el) => (el.textContent || '').trim() === label)
        .first();
      return $button as JQuery<HTMLElement>;
    });
  }

  static expectActionButtonInOpenMenu(label: string): Cypress.Chainable<JQuery<HTMLElement>> {
    return ContactsDeleteHelpers.findActionButtonInOpenMenu(label).then(($button) => {
      if (!$button.length) {
        throw new Error(`Expected "${label}" action to be present in the open menu.`);
      }
      return cy.wrap($button);
    });
  }

  static assertActionButtonEnabled($button: JQuery<HTMLElement>, label = 'Action') {
    const disabled = ContactsDeleteHelpers.isDisabled($button);
    expect(disabled, `${label} action should be enabled`).to.eq(false);
  }

  static assertActionButtonDisabled($button: JQuery<HTMLElement>, label = 'Action') {
    const disabled = ContactsDeleteHelpers.isDisabled($button);
    expect(disabled, `${label} action should be disabled`).to.eq(true);
  }

  static assertConfirmDeleteModalVisible() {
    ContactsDeleteHelpers.getConfirmDeleteDialog().within(() => {
      cy.contains(/Confirm/i).should('be.visible');
      cy.contains(CONFIRM_DELETE_TEXT).should('be.visible');
      cy.contains('button', /^Cancel$/).should('be.visible');
      cy.contains('button', /^Confirm$/).should('be.visible');
    });
  }

  static assertNoConfirmDeleteModal() {
    cy.get('body').should(($body) => {
      const matches = $body
        .find('dialog, [role="dialog"], .p-dialog')
        .filter((_, el) => CONFIRM_DELETE_TEXT.test(el.textContent || ''));
      expect(matches.filter(':visible').length, 'confirm delete dialog visible').to.eq(0);
    });
  }

  static confirmDeleteModalIfPresent(action: 'Cancel' | 'Confirm' | 'No' | 'Close' = 'Cancel') {
    const label = action === 'No' ? 'Cancel' : action;
    return cy.get('body').then(($body) => {
      const $dialog = $body
        .find('dialog, [role="dialog"], .p-dialog')
        .filter((_, el) => CONFIRM_DELETE_TEXT.test(el.textContent || ''))
        .filter(':visible')
        .first();
      if (!$dialog.length) return;
      if (label === 'Close') {
        const $close = $dialog.find('[aria-label="Cancel"]').first();
        if ($close.length) {
          return cy.wrap($close).click({ force: true });
        }
        throw new Error('Confirm delete dialog close icon not found.');
      }

      const $button = $dialog
        .find('button')
        .filter((_, el) => (el.textContent || '').trim() === label)
        .first();
      if ($button.length) {
        return cy.wrap($button).click({ force: true });
      }
      if (label === 'Cancel') {
        const $close = $dialog.find('[aria-label="Cancel"]').first();
        if ($close.length) {
          return cy.wrap($close).click({ force: true });
        }
      }
      throw new Error(`Confirm delete dialog is visible but "${label}" action was not found.`);
    });
  }

  static openRestoreDeletedContactsModal() {
    PageUtils.clickButton('Restore deleted contacts', '', true);
    const dialog = ContactsDeleteHelpers.getRestoreDeletedContactsDialog();
    dialog.contains('button', /Restore selected/i).should('be.visible');
    return dialog;
  }

  static openRestoreResultsPerPageSelect() {
    return ContactsDeleteHelpers.getRestoreDeletedContactsDialog()
      .contains(/Results per page/i)
      .should('be.visible')
      .parent()
      .then(($wrap) => {
        const $label = $wrap
          .find('p-select [data-pc-section="label"], p-select .p-select-label')
          .filter(':visible')
          .first();
        if ($label.length) return cy.wrap($label).scrollIntoView().click();
        const $root = $wrap
          .find('p-select[data-pc-section="root"], p-select.p-select')
          .filter(':visible')
          .first();
        if ($root.length) return cy.wrap($root).scrollIntoView().click();
        const $trigger = $wrap.find('.p-select-dropdown, [aria-label="dropdown trigger"]').first();
        if ($trigger.length) return cy.wrap($trigger).scrollIntoView().click({ force: true });
        throw new Error('Results-per-page select not found in restore dialog.');
      });
  }

  static setRestoreResultsPerPage(value: 20 | 15 | 10 | 5 = 20) {
    ContactsDeleteHelpers.openRestoreResultsPerPageSelect();
    cy.get('body')
      .find('[role="listbox"], .p-select-list')
      .filter(':visible')
      .last()
      .within(() => {
        cy.contains('[role="option"], .p-select-option', String(value))
          .should('be.visible')
          .click();
      });
  }

  static selectDeletedContactInRestoreModal(
    contactName: string,
    options: { maxPages?: number; waitAlias?: string } = {},
  ): Cypress.Chainable<JQuery<HTMLElement>> {
    const maxPages = options.maxPages ?? 25;
    const waitForPageLoad = (): Cypress.Chainable<any> => {
      if (options.waitAlias) {
        return cy.wait(`@${options.waitAlias}`);
      }
      return cy.wrap(null, { log: false });
    };
    const tryPage = (page: number): Cypress.Chainable<JQuery<HTMLElement>> => {
      if (page >= maxPages) {
        throw new Error(
          `Could not find deleted contact "${contactName}" in Restore modal after checking ${maxPages} pages.`,
        );
      }

      return ContactsDeleteHelpers.getRestoreDeletedContactsDialog().then(($dialog) => {
        const $row = $dialog
          .find('tbody tr')
          .filter((_, el) => (el.textContent || '').includes(contactName))
          .first();

        if ($row.length) {
          return cy.wrap($row)
            .within(() => {
              cy.get('input[type="checkbox"], .p-checkbox-box').first().click({ force: true });
            })
            .then(() => $row);
        }

        const $next = $dialog
          .find('button[aria-label="Next Page"], .p-paginator-next')
          .filter(':visible')
          .first();
        if (!$next.length || ContactsDeleteHelpers.isDisabled($next)) {
          throw new Error(`Could not find deleted contact "${contactName}" before last page.`);
        }

        cy.wrap($next).click({ force: true });
        return waitForPageLoad().then(() => tryPage(page + 1));
      });
    };

    return cy.then(() => tryPage(0));
  }

  static deleteContact(
    contactName: string,
    options: {
      deleteAlias?: string;
      contactsGoneAlias?: string | null;
      listAlias?: string;
    } = {},
  ) {
    const deleteAlias = options.deleteAlias ?? 'deleteContact';
    const contactsGoneAlias = options.contactsGoneAlias ?? 'contactsGone';

    cy.contains('tbody tr', contactName, { timeout: 15000 }).should('be.visible');
    PageUtils.clickKababItem(contactName, 'Delete');
    ContactsDeleteHelpers.assertConfirmDeleteModalVisible();
    ContactsDeleteHelpers.clickConfirmDeleteModalButton('Confirm');
    cy.wait(`@${deleteAlias}`);
    if (options.listAlias) {
      cy.wait(`@${options.listAlias}`);
    }
    if (contactsGoneAlias) {
      cy.wait(`@${contactsGoneAlias}`);
    }
    cy.contains('tbody tr', contactName, { timeout: 15000 }).should('not.exist');
  }

  static restoreContact(contactName: string, options: { listAlias?: string } = {}) {
    cy.intercept('POST', '**/api/v1/contacts-deleted/restore/**').as('restoreContact');
    cy.intercept('GET', '**/api/v1/contacts-deleted/?page=**').as('getDeletedContacts');

    ContactsDeleteHelpers.getRestoreDeletedContactsDialog()
      .contains('tbody tr', contactName, { timeout: 15000 })
      .should('be.visible')
      .find('.p-checkbox-input')
      .check({ force: true });

    cy.contains('button,a', 'Restore selected').click();
    cy.wait('@restoreContact');
    cy.wait('@getDeletedContacts');
    if (options.listAlias) {
      cy.wait(`@${options.listAlias}`);
    }
  }
}
