import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { ContactsDeleteHelpers, ContactsHelpers } from './contacts.helpers';
import { currentYear } from '../../e2e-smoke/pages/pageUtils';
import { makeContact } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, Organization_A } from '../../e2e-smoke/requests/library/contacts';
import type { MockContact } from '../../e2e-smoke/requests/library/contacts';
import { F3X_Q2 } from '../../e2e-smoke/requests/library/reports';

const UNLINKED_CONTACT = 'Organization A Updated';
const LINKED_CONTACT = 'House, Beth';
const LINKED_TRANSACTION_DATE = `${currentYear}-04-12`;

const RUN_LINKED_DELETE_API_TEST =
  Cypress.env('RUN_LINKED_DELETE_API_TEST') === true ||
  Cypress.env('RUN_LINKED_DELETE_API_TEST') === 'true';

type ContactListItem = {
  id: string;
  name?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  has_transaction_or_report?: boolean | null;
};

type ContactListResponse = {
  results?: ContactListItem[];
};

type ReportListItem = {
  id: string;
  report_type?: string | null;
  report_code?: string | null;
  coverage_from_date?: string | null;
  coverage_through_date?: string | null;
  form_type?: string | null;
};

type ReportListResponse = {
  results?: ReportListItem[];
};

type TransactionListItem = {
  id: string;
  contact_1_id?: string | null;
  contact_1?: { first_name?: string | null; last_name?: string | null } | null;
  contributor_first_name?: string | null;
  contributor_last_name?: string | null;
};

type TransactionListResponse = {
  results?: TransactionListItem[];
};

const UNLINKED_CONTACT_DATA: MockContact = {
  ...Organization_A,
  name: UNLINKED_CONTACT,
};

const LINKED_CONTACT_DATA: MockContact = {
  ...Individual_A_A,
  last_name: 'House',
  first_name: 'Beth',
};

describe('Contacts - delete guard', () => {
  beforeEach(() => {
    Initialize();
    cy.intercept('GET', '**/api/v1/contacts/**page_size=**').as('getContactsList');
    ContactsDeleteHelpers.seedContactsWithLinkedTransaction({
      unlinkedContact: UNLINKED_CONTACT_DATA,
      linkedContact: LINKED_CONTACT_DATA,
      report: F3X_Q2,
      transactionDate: LINKED_TRANSACTION_DATE,
    });
    ContactListPage.goToPage();
    cy.wait('@getContactsList');
  });

  it('Unlinked: delete -> confirm modal -> success toast -> row removed; restore deleted contact works', () => {
    cy.intercept('DELETE', '**/api/v1/contacts/**').as('deleteContact');
    cy.intercept('GET', '**/api/v1/contacts-deleted/**').as('getDeletedContacts');
    cy.intercept('POST', '**/api/v1/contacts-deleted/restore/**').as('restoreContact');

    ContactsDeleteHelpers.getContactRow(UNLINKED_CONTACT);
    ContactsDeleteHelpers.openActionsMenu(UNLINKED_CONTACT);
    ContactsDeleteHelpers.expectActionButtonInOpenMenu('Delete')
      .should(($button) => {
        ContactsDeleteHelpers.assertActionButtonEnabled($button, 'Delete');
      })
      .click({ force: true });

    ContactsDeleteHelpers.assertConfirmDeleteModalVisible();
    ContactsDeleteHelpers.clickConfirmDeleteModalButton('Confirm');

    cy.wait('@deleteContact')
      .its('response.statusCode')
      .should('be.oneOf', [200, 204]);
    cy.wait('@getContactsList');
    cy.wait('@getDeletedContacts');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tbody tr', UNLINKED_CONTACT).should('not.exist');
    cy.contains('button,a', 'Restore deleted contacts').should('be.visible');

    ContactsDeleteHelpers.openRestoreDeletedContactsModal();
    cy.wait('@getDeletedContacts');
    cy.get('#restoreButton').should('be.disabled');
    ContactsDeleteHelpers.selectDeletedContactInRestoreModal(UNLINKED_CONTACT);
    cy.get('#restoreButton').should('not.be.disabled').click();

    cy.wait('@restoreContact');
    cy.wait('@getContactsList');
    cy.wait('@getDeletedContacts');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tbody tr', UNLINKED_CONTACT).should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts').should('not.exist');
  });

  it('Linked: delete is not actionable (hidden or disabled); blocked after refresh; cannot bypass via DOM/script clicks', () => {
    let deleteRequests = 0;
    const deleteStatusCodes: number[] = [];
    const deleteResponses: Array<{ statusCode: number; body: unknown }> = [];
    const logDeleteResponse = (statusCode: number, body: unknown) => {
      let bodyPreview = '';
      try {
        const serialized = JSON.stringify(body ?? null);
        bodyPreview = serialized ?? '';
      } catch (error) {
        bodyPreview = String(error);
      }
      Cypress.log({
        name: 'deleteContact response',
        message: `status ${statusCode} body ${bodyPreview.slice(0, 500)}`,
      });
    };

    cy.intercept('DELETE', '**/api/v1/contacts/**', (req) => {
      deleteRequests += 1;
      req.on('response', (res) => {
        deleteStatusCodes.push(res.statusCode);
        deleteResponses.push({ statusCode: res.statusCode, body: res.body });
        logDeleteResponse(res.statusCode, res.body);
      });
      req.continue();
    }).as('deleteContact');

    const assertLinkedContactIsLinked = (attempt = 1): Cypress.Chainable<null> => {
      const maxAttempts = 3;
      return cy
        .reload()
        .then(() => cy.wait('@getContactsList'))
        .then((interception) => {
          const results = interception.response?.body?.results;
          const linkedContact = Array.isArray(results)
            ? results.find((contact) => {
                const firstName = (contact.first_name || '').trim();
                const lastName = (contact.last_name || '').trim();
                const name = (contact.name || '').trim();
                return (
                  (firstName === LINKED_CONTACT_DATA.first_name &&
                    lastName === LINKED_CONTACT_DATA.last_name) ||
                  name === LINKED_CONTACT
                );
              })
            : null;

          if (linkedContact?.has_transaction_or_report) {
            return cy.wrap(null, { log: false });
          }

          if (attempt >= maxAttempts) {
            const details = linkedContact
              ? `found but has_transaction_or_report=${linkedContact.has_transaction_or_report}`
              : 'not found in contacts list response';
            throw new Error(
              `Setup error: linked contact "${LINKED_CONTACT}" was ${details} after ${attempt} attempts.`,
            );
          }

          cy.log(
            `Linked contact not marked as linked yet (attempt ${attempt}/${maxAttempts}); retrying.`,
          );
          return assertLinkedContactIsLinked(attempt + 1);
        });
    };

    const assertDeleteUnavailable = () => {
      ContactsDeleteHelpers.getContactRow(LINKED_CONTACT);
      ContactsDeleteHelpers.openActionsMenu(LINKED_CONTACT);
      return ContactsDeleteHelpers.findActionButtonInOpenMenu('Delete').then(($deleteBtn) => {
        if (!$deleteBtn.length) {
          cy.log('Delete option is hidden for linked contact (expected).');
          return;
        }
        ContactsDeleteHelpers.assertActionButtonDisabled($deleteBtn, 'Delete');
      });
    };

    assertLinkedContactIsLinked();

    const attemptDelete = (action: 'Cancel' | 'Close' | 'Confirm', assertDisabled = false) => {
      ContactsDeleteHelpers.getContactRow(LINKED_CONTACT);
      ContactsDeleteHelpers.openActionsMenu(LINKED_CONTACT);
      return ContactsDeleteHelpers.findActionButtonInOpenMenu('Delete').then(($deleteBtn) => {
        if (!$deleteBtn.length) {
          cy.log('Delete option is hidden for linked contact (expected).');
          return;
        }
        if (assertDisabled) {
          ContactsDeleteHelpers.assertActionButtonDisabled($deleteBtn, 'Delete');
        }
        cy.wrap($deleteBtn).invoke('removeAttr', 'disabled');
        cy.wrap($deleteBtn).click({ force: true });
        ContactsDeleteHelpers.confirmDeleteModalIfPresent(action);
        ContactsDeleteHelpers.assertNoConfirmDeleteModal();
      });
    };

    attemptDelete('Cancel', true);
    attemptDelete('Close');

    cy.then(() => {
      if (!deleteRequests) {
        return cy.wrap(null, { log: false });
      }
      return cy.wait('@deleteContact', { timeout: 15000 });
    });

    cy.then(() => {
      const successResponses = deleteResponses.filter((res) => [200, 204].includes(res.statusCode));
      if (successResponses.length) {
        successResponses.forEach((res) => logDeleteResponse(res.statusCode, res.body));
        throw new Error(
          `Delete unexpectedly succeeded for linked contact (status ${successResponses
            .map((res) => res.statusCode)
            .join(', ')}). Expected 403/409 or no request.`,
        );
      }
      if (deleteResponses.length) {
        const unexpected = deleteResponses.filter((res) => ![403, 409].includes(res.statusCode));
        if (unexpected.length) {
          unexpected.forEach((res) => logDeleteResponse(res.statusCode, res.body));
          throw new Error(
            `Unexpected delete response status for linked contact: ${unexpected
              .map((res) => res.statusCode)
              .join(', ')}. Expected 403/409.`,
          );
        }
      }
      if (!deleteStatusCodes.length) {
        expect(deleteRequests, 'No DELETE calls should be made').to.eq(0);
      }
    });

    ContactsDeleteHelpers.getContactRow(LINKED_CONTACT);
    cy.reload();
    cy.wait('@getContactsList');
    assertDeleteUnavailable();

    // Then unlink the transaction w/ contact to allow deletion
    const fetchLinkedContact = (): Cypress.Chainable<ContactListItem> =>
      ContactsDeleteHelpers.requestWithCookies<ContactListResponse>(
        'GET',
        'http://localhost:8080/api/v1/contacts/?page=1&ordering=sort_name&page_size=50',
      ).then((response) => {
        const results = Array.isArray(response.body?.results) ? response.body.results : [];
        const linkedContact = results.find((contact) => {
          const firstName = (contact.first_name || '').trim();
          const lastName = (contact.last_name || '').trim();
          const name = (contact.name || '').trim();
          return (
            (firstName === LINKED_CONTACT_DATA.first_name &&
              lastName === LINKED_CONTACT_DATA.last_name) ||
            name === LINKED_CONTACT
          );
        });

        if (!linkedContact?.id) {
          throw new Error(`Unable to locate linked contact "${LINKED_CONTACT}" for cleanup.`);
        }
        return cy.wrap(linkedContact, { log: false });
      });

    const fetchReport = (): Cypress.Chainable<ReportListItem> =>
      ContactsDeleteHelpers.requestWithCookies<ReportListResponse>(
        'GET',
        'http://localhost:8080/api/v1/reports/?page=1&ordering=-coverage_through_date&page_size=25',
      ).then((response) => {
        const results = Array.isArray(response.body?.results) ? response.body.results : [];
        const report = results.find((item) => {
          const matchesCode = item.report_code === F3X_Q2.report_code;
          const matchesCoverage =
            item.coverage_from_date === F3X_Q2.coverage_from_date &&
            item.coverage_through_date === F3X_Q2.coverage_through_date;
          return item.report_type === F3X_Q2.report_type && matchesCode && matchesCoverage;
        });

        if (!report?.id) {
          throw new Error(`Unable to locate seeded report ${F3X_Q2.report_code} for cleanup.`);
        }
        return cy.wrap(report, { log: false });
      });

    const fetchLinkedTransactionId = (
      reportId: string,
      contactId: string,
    ): Cypress.Chainable<string> =>
      ContactsDeleteHelpers.requestWithCookies<TransactionListResponse>(
        'GET',
        `http://localhost:8080/api/v1/transactions/?page=1&ordering=-created&page_size=50&report_id=${reportId}&schedules=A`,
      ).then((response) => {
        const results = Array.isArray(response.body?.results) ? response.body.results : [];
        const transaction = results.find((item) => {
          if (item.contact_1_id === contactId) return true;
          const firstName =
            (item.contact_1?.first_name || item.contributor_first_name || '').trim();
          const lastName =
            (item.contact_1?.last_name || item.contributor_last_name || '').trim();
          return (
            firstName === LINKED_CONTACT_DATA.first_name &&
            lastName === LINKED_CONTACT_DATA.last_name
          );
        });

        if (!transaction?.id) {
          throw new Error(
            `Unable to locate linked transaction for contact "${LINKED_CONTACT}" in report ${reportId}.`,
          );
        }
        return cy.wrap(transaction.id, { log: false });
      });

    const assertLinkedContactUnlinked = (attempt = 1): Cypress.Chainable<null> => {
      const maxAttempts = 3;
      return cy
        .reload()
        .then(() => cy.wait('@getContactsList'))
        .then((interception) => {
          const results = interception.response?.body?.results;
          const linkedContact = Array.isArray(results)
            ? results.find((contact) => {
                const firstName = (contact.first_name || '').trim();
                const lastName = (contact.last_name || '').trim();
                const name = (contact.name || '').trim();
                return (
                  (firstName === LINKED_CONTACT_DATA.first_name &&
                    lastName === LINKED_CONTACT_DATA.last_name) ||
                  name === LINKED_CONTACT
                );
              })
            : null;

          if (linkedContact && !linkedContact.has_transaction_or_report) {
            return cy.wrap(null, { log: false });
          }

          if (attempt >= maxAttempts) {
            const details = linkedContact
              ? `found but has_transaction_or_report=${linkedContact.has_transaction_or_report}`
              : 'not found in contacts list response';
            throw new Error(
              `Cleanup error: linked contact "${LINKED_CONTACT}" was ${details} after ${attempt} attempts.`,
            );
          }

          cy.log(
            `Linked contact still marked as linked (attempt ${attempt}/${maxAttempts}); retrying.`,
          );
          return assertLinkedContactUnlinked(attempt + 1);
        });
    };

    cy.then(() =>
      fetchLinkedContact().then((linkedContact) =>
        fetchReport().then((report) =>
          fetchLinkedTransactionId(report.id, linkedContact.id).then((transactionId) =>
            ContactsDeleteHelpers.requestWithCookies(
              'DELETE',
              `http://localhost:8080/api/v1/transactions/${transactionId}/`,
            ).then(() =>
              ContactsDeleteHelpers.requestWithCookies(
                'DELETE',
                `http://localhost:8080/api/v1/reports/${report.id}/`,
              ),
            ),
          ),
        ),
      ),
    ).then(() => assertLinkedContactUnlinked());

    ContactsDeleteHelpers.getContactRow(LINKED_CONTACT);
    ContactsDeleteHelpers.openActionsMenu(LINKED_CONTACT);
    ContactsDeleteHelpers.expectActionButtonInOpenMenu('Delete')
      .should(($button) => {
        ContactsDeleteHelpers.assertActionButtonEnabled($button, 'Delete');
      })
      .click({ force: true });

    ContactsDeleteHelpers.assertConfirmDeleteModalVisible();
    ContactsDeleteHelpers.clickConfirmDeleteModalButton('Confirm');
    cy.wait('@deleteContact')
      .its('response.statusCode')
      .should('be.oneOf', [200, 204]);
    cy.wait('@getContactsList');
    cy.contains('tbody tr', LINKED_CONTACT).should('not.exist');
  });

  it('Restore deleted contacts', () => {
    cy.intercept('DELETE', '**/api/v1/contacts/**').as('deleteContact');
    cy.intercept('GET', '**/api/v1/contacts-deleted/**').as('getDeletedContacts');
    cy.intercept('POST', '**/api/v1/contacts-deleted/restore/**').as('restoreContact');

    ContactsDeleteHelpers.getContactRow(UNLINKED_CONTACT);
    ContactsDeleteHelpers.openActionsMenu(UNLINKED_CONTACT);
    ContactsDeleteHelpers.expectActionButtonInOpenMenu('Delete')
      .should(($button) => {
        ContactsDeleteHelpers.assertActionButtonEnabled($button, 'Delete');
      })
      .click({ force: true });

    ContactsDeleteHelpers.assertConfirmDeleteModalVisible();
    ContactsDeleteHelpers.clickConfirmDeleteModalButton('Confirm');

    cy.wait('@deleteContact');
    cy.wait('@getContactsList');
    cy.wait('@getDeletedContacts');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('button,a', 'Restore deleted contacts').should('be.visible');

    ContactsDeleteHelpers.openRestoreDeletedContactsModal();
    cy.wait('@getDeletedContacts');
    ContactsDeleteHelpers.getRestoreDeletedContactsDialog().within(() => {
      cy.contains('.paginator-text', /showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+\w+/i).should('exist');
    });
    cy.get('#restoreButton').should('be.disabled');
    ContactsDeleteHelpers.selectDeletedContactInRestoreModal(UNLINKED_CONTACT);
    cy.get('#restoreButton').should('not.be.disabled').click();

    cy.wait('@restoreContact');
    cy.wait('@getContactsList');
    cy.wait('@getDeletedContacts');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tbody tr', UNLINKED_CONTACT).should('be.visible');
    cy.contains('button,a', 'Restore deleted contacts').should('not.exist');
  });

  /**
   * DELETE /api/v1/contacts/:id allows deletion when has_transaction_or_report=true
   * but should be blocked with 403 or 409 response
   * needs changes in backend to enforce properly
   */
  xit('Linked: API delete is rejected (403/409)', () => {
    const fetchLinkedContact = (attempt = 1): Cypress.Chainable<ContactListItem> => {
      const maxAttempts = 3;
      return ContactsDeleteHelpers.requestWithCookies<ContactListResponse>(
        'GET',
        'http://localhost:8080/api/v1/contacts/?page=1&ordering=sort_name&page_size=10',
      ).then((response) => {
        const results = Array.isArray(response.body?.results) ? response.body.results : [];
        const linkedContact = results.find((contact) => {
          const firstName = (contact.first_name || '').trim();
          const lastName = (contact.last_name || '').trim();
          const name = (contact.name || '').trim();
          return (
            (firstName === LINKED_CONTACT_DATA.first_name &&
              lastName === LINKED_CONTACT_DATA.last_name) ||
            name === LINKED_CONTACT
          );
        });

        if (linkedContact?.has_transaction_or_report) {
          return cy.wrap(linkedContact, { log: false });
        }

        if (attempt >= maxAttempts) {
          const details = linkedContact
            ? `found but has_transaction_or_report=${linkedContact.has_transaction_or_report}`
            : 'not found in contacts list response';
          throw new Error(
            `Setup error: linked contact "${LINKED_CONTACT}" was ${details} after ${attempt} attempts.`,
          );
        }

        cy.log(
          `Linked contact not marked as linked yet (attempt ${attempt}/${maxAttempts}); retrying.`,
        );
        return fetchLinkedContact(attempt + 1);
      });
    };

    return fetchLinkedContact().then((linkedContact) =>
      ContactsDeleteHelpers.requestWithCookies(
        'DELETE',
        `http://localhost:8080/api/v1/contacts/${linkedContact.id}/`,
        undefined,
        { failOnStatusCode: false },
      ).then((response) => {
        let bodyPreview = '';
        try {
          const serialized = JSON.stringify(response.body ?? null);
          bodyPreview = serialized ?? '';
        } catch (error) {
          bodyPreview = String(error);
        }
        Cypress.log({
          name: 'deleteContact api',
          message: `status ${response.status} body ${bodyPreview.slice(0, 500)}`,
        });
        expect(
          response.status,
          'DELETE should be blocked for linked contact (expected 403/409)',
        ).to.be.oneOf([403, 409]);
      }),
    );
  });
});

describe('Contacts Soft and Hard Delete (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    cy.intercept('GET', '**/api/v1/contacts/**page_size=**').as('getContactsList');
    ContactListPage.goToPage();
    cy.wait('@getContactsList');
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
    cy.contains('button,a', 'Restore deleted contacts').should('not.exist');
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
    ContactsDeleteHelpers.deleteContact(contactToDelete);
    ContactsDeleteHelpers.deleteContact(contactToRestore);
    ContactsHelpers.assertSuccessToastMessage();
    cy.intercept('GET', '**/api/v1/contacts-deleted/?page=1&ordering=sort_name**').as('getDeletedContacts');
    ContactsDeleteHelpers.openRestoreDeletedContactsModal();
    cy.wait('@getDeletedContacts');
    ContactsDeleteHelpers.getRestoreDeletedContactsDialog().should('be.visible');
    ContactsDeleteHelpers.getRestoreDeletedContactsDialog().within(() => {
      cy.contains('tbody tr', contactToDelete, { timeout: 15000 }).should('be.visible');
      cy.contains('tbody tr', contactToRestore, { timeout: 15000 }).should('be.visible');
      cy.contains('tbody tr', contactToPreserve, { timeout: 15000 }).should('not.exist');
    });
    ContactsDeleteHelpers.restoreContact(contactToRestore);
    ContactListPage.goToPage();
    cy.wait('@getContactsList');
    cy.contains('tbody tr', contactToPreserve, { timeout: 15000 }).should('be.visible');
    cy.contains('tbody tr', contactToRestore, { timeout: 15000 }).should('be.visible');
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
