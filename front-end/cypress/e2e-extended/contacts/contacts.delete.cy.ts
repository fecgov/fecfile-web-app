
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { ContactsHelpers } from './contacts.helpers';
import { PageUtils, currentYear } from '../../e2e-smoke/pages/pageUtils';
import { makeContact, makeF3x, makeTransaction } from '../../e2e-smoke/requests/methods';
import { Individual_A_A, Organization_A } from '../../e2e-smoke/requests/library/contacts';
import type { MockContact } from '../../e2e-smoke/requests/library/contacts';
import { buildScheduleA } from '../../e2e-smoke/requests/library/transactions';
import { F3X_Q2 } from '../../e2e-smoke/requests/library/reports';
import type { Contact } from '../../../src/app/shared/models';

const UNLINKED_CONTACT = 'Organization A Updated';
const LINKED_CONTACT = 'House, Beth';
const LINKED_TRANSACTION_DATE = `${currentYear}-04-12`;
const CONFIRM_DELETE_TEXT = /Are you sure you want to delete this item\?/i;

const UNLINKED_CONTACT_DATA: MockContact = {
  ...Organization_A,
  name: UNLINKED_CONTACT,
};

const LINKED_CONTACT_DATA: MockContact = {
  ...Individual_A_A,
  last_name: 'House',
  first_name: 'Beth',
};

function createContact(contact: MockContact) {
  return new Cypress.Promise<Contact>((resolve) => {
    makeContact(contact, (response) => {
      resolve(response.body as Contact);
    });
  });
}

function createReport() {
  return new Cypress.Promise<string>((resolve) => {
    makeF3x(F3X_Q2, (response) => {
      resolve(response.body.id);
    });
  });
}

function createLinkedTransaction(contact: Contact, reportId: string) {
  const transaction = buildScheduleA('INDIVIDUAL_RECEIPT', 200.01, LINKED_TRANSACTION_DATE, contact, reportId);
  return new Cypress.Promise<void>((resolve) => {
    makeTransaction(transaction, () => resolve());
  });
}

function seedContactsWithLinkedTransaction() {
  return createContact(UNLINKED_CONTACT_DATA)
    .then(() => createContact(LINKED_CONTACT_DATA))
    .then((linkedContact) =>
      createReport().then((reportId) => createLinkedTransaction(linkedContact, reportId)),
    );
}

function isDisabled($el: JQuery<HTMLElement>) {
  return $el.is(':disabled') || $el.hasClass('p-disabled') || $el.attr('aria-disabled') === 'true';
}

function getDialogByText(text: RegExp) {
  return cy.contains('dialog, [role="dialog"], .p-dialog', text).should('be.visible');
}

function getConfirmDeleteDialog() {
  return getDialogByText(CONFIRM_DELETE_TEXT);
}

function clickConfirmDeleteModalButton(label: 'Cancel' | 'Confirm') {
  getConfirmDeleteDialog().contains('button', new RegExp(`^${label}$`)).click({ force: true });
}

function getRestoreDeletedContactsDialog() {
  return getDialogByText(/Restore deleted contacts/i);
}

function getContactRow(contactName: string) {
  return cy.contains('tr', contactName).should('be.visible');
}

function openActionsMenu(contactName: string) {
  PageUtils.blurActiveField();
  PageUtils.getKabob(contactName);
  cy.get('.p-popover').filter(':visible').should('exist');
  cy.get('.p-popover').filter(':visible').contains('button', /Edit/i).should('be.visible');
}

function findActionButtonInOpenMenu(label: string) {
  return cy.get('body').then(($body) => {
    const $popover = $body.find('.p-popover:visible').first();
    const $button = $popover
      .find('button')
      .filter((_, el) => (el.textContent || '').trim() === label)
      .first();
    return $button.length ? $button : null;
  });
}

function expectActionButtonInOpenMenu(label: string) {
  return findActionButtonInOpenMenu(label).then(($button) => {
    if (!$button) {
      throw new Error(`Expected "${label}" action to be present in the open menu.`);
    }
    return cy.wrap($button);
  });
}

function assertConfirmDeleteModalVisible() {
  getConfirmDeleteDialog().within(() => {
    cy.contains(/Confirm/i).should('be.visible');
    cy.contains(CONFIRM_DELETE_TEXT).should('be.visible');
    cy.contains('button', /^Cancel$/).should('be.visible');
    cy.contains('button', /^Confirm$/).should('be.visible');
  });
}

function assertNoConfirmDeleteModal() {
  cy.get('dialog, [role="dialog"], .p-dialog').then(($dialogs) => {
    const matches = $dialogs.filter((_, el) => CONFIRM_DELETE_TEXT.test(el.textContent || ''));
    if (!matches.length) return;
    expect(matches.filter(':visible').length, 'confirm delete dialog visible').to.eq(0);
  });
}

function openRestoreDeletedContactsModal() {
  PageUtils.clickButton('Restore deleted contacts', '', true);
  const dialog = getRestoreDeletedContactsDialog();
  dialog.contains('button', /Restore selected/i).should('be.visible');
  return dialog;
}

function openRestoreResultsPerPageSelect() {
  return getRestoreDeletedContactsDialog()
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

function setRestoreResultsPerPage(value: 20 | 15 | 10 | 5 = 20) {
  openRestoreResultsPerPageSelect();
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

function selectDeletedContactInRestoreModal(contactName: string) {
  const maxPages = 25;
  const tryPage = (page: number) => {
    if (page >= maxPages) {
      throw new Error(
        `Could not find deleted contact "${contactName}" in Restore modal after checking ${maxPages} pages.`,
      );
    }

    getRestoreDeletedContactsDialog().then(($dialog) => {
      const $row = $dialog
        .find('tbody tr')
        .filter((_, el) => (el.textContent || '').includes(contactName))
        .first();

      if ($row.length) {
        cy.wrap($row).within(() => {
          cy.get('input[type="checkbox"], .p-checkbox-box').first().click({ force: true });
        });
        return;
      }

      const $next = $dialog
        .find('button[aria-label="Next Page"], .p-paginator-next')
        .filter(':visible')
        .first();
      if (!$next.length || isDisabled($next)) {
        throw new Error(`Could not find deleted contact "${contactName}" before last page.`);
      }

      cy.wrap($next).click({ force: true });
      tryPage(page + 1);
    });
  };

  tryPage(0);
}

describe('Contacts - delete guard', () => {
  beforeEach(() => {
    Initialize();
    seedContactsWithLinkedTransaction();
    ContactListPage.goToPage();
  });

  xit('Unlinked: delete -> confirm modal -> success toast -> row removed; restore deleted contact works', () => {
    let deleteRequests = 0;
    cy.intercept('DELETE', '**/contacts/**', (req) => {
      deleteRequests += 1;
      req.continue();
    }).as('deleteContact');

    getContactRow(UNLINKED_CONTACT);
    openActionsMenu(UNLINKED_CONTACT);
    expectActionButtonInOpenMenu('Delete').should('not.be.disabled').click();
    assertConfirmDeleteModalVisible();
    clickConfirmDeleteModalButton('Confirm');

    cy.then(() => {
      if (deleteRequests > 0) {
        cy.wait('@deleteContact').its('response.statusCode').should('be.oneOf', [200, 204]);
      }
    });

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tr', UNLINKED_CONTACT).should('not.exist');

    openRestoreDeletedContactsModal();
    setRestoreResultsPerPage(20);
    selectDeletedContactInRestoreModal(UNLINKED_CONTACT);
    cy.contains('button', /Restore selected/i).should('not.be.disabled');
    cy.contains('button', /Restore selected/i).click({ force: true });
    cy.contains('button', /Restore selected/i).should('not.exist');
    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tr', UNLINKED_CONTACT).should('be.visible');
  });

  xit('Linked: delete is not actionable (hidden or disabled); blocked after refresh; cannot bypass via DOM/script clicks', () => {
    let deleteRequests = 0;
    cy.intercept('DELETE', '**/contacts/**', (req) => {
      deleteRequests += 1;
      req.continue();
    }).as('deleteContact');

    //linked contact exists
    getContactRow(LINKED_CONTACT);

    // Open menu and validate Delete is disabled
    openActionsMenu(LINKED_CONTACT);

    findActionButtonInOpenMenu('Delete').then(($deleteBtn) => {
      if (!$deleteBtn) {
        cy.log('Delete option is hidden for linked contact (expected).');
        return;
      }
      cy.wrap($deleteBtn).should('be.disabled');

      // Negative check 1: Force click (Cypress-level bypass)
      cy.wrap($deleteBtn).click({ force: true });
      assertConfirmDeleteModalVisible();
      clickConfirmDeleteModalButton('Cancel');
      assertNoConfirmDeleteModal();
    });

    // Negative check 2: DOM/script “enable” attempt (remove disabled attr & click)
    openActionsMenu(LINKED_CONTACT);
    findActionButtonInOpenMenu('Delete').then(($deleteBtn) => {
      if (!$deleteBtn) return;
      cy.wrap($deleteBtn).invoke('removeAttr', 'disabled').click({ force: true });
      assertConfirmDeleteModalVisible();
      clickConfirmDeleteModalButton('Cancel');
      assertNoConfirmDeleteModal();
    });

    cy.then(() => {
      expect(deleteRequests, 'No DELETE calls should be made').to.eq(0);
    });

    cy.contains('tr', LINKED_CONTACT).should('be.visible');
    cy.reload();
    cy.contains(/Manage contacts/i).should('be.visible');
    getContactRow(LINKED_CONTACT);
    openActionsMenu(LINKED_CONTACT);
    findActionButtonInOpenMenu('Delete').then(($deleteBtn) => {
      if (!$deleteBtn) {
        cy.log('Delete option remains hidden after refresh (expected).');
        return;
      }
      cy.wrap($deleteBtn).should('be.disabled');
    });
  });

  xit('Restore deleted contacts', () => {
    getContactRow(UNLINKED_CONTACT);
    openActionsMenu(UNLINKED_CONTACT);
    expectActionButtonInOpenMenu('Delete').should('not.be.disabled').click();
    assertConfirmDeleteModalVisible();
    clickConfirmDeleteModalButton('Confirm');
    ContactsHelpers.assertSuccessToastMessage();
    cy.get('.restore-contact-button').should('be.visible');
    openRestoreDeletedContactsModal();
    getRestoreDeletedContactsDialog()
      .contains('.paginator-text', /showing\s+\d+\s+to\s+\d+\s+of\s+\d+\s+entries:?/i)
      .should('exist');
    cy.get('#restoreButton').should('be.disabled');
    selectDeletedContactInRestoreModal(UNLINKED_CONTACT);
    cy.get('#restoreButton').should('not.be.disabled').click();
    cy.get('#restoreButton').should('not.exist');
    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('tr', UNLINKED_CONTACT).should('be.visible');
    cy.contains('button', /Restore deleted contacts/i).should('not.exist');
  });
});
