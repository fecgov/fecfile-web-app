/* eslint-disable @typescript-eslint/no-explicit-any */
import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { PageUtils } from '../../e2e/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';
import { makeContact, makeTransaction } from '../../e2e/requests/methods';
import { buildScheduleA } from '../../e2e/requests/library/transactions';
import {
  Individual_A_A,
  Candidate_House_A,
  Committee_A,
  Organization_A,
  MockContact,
} from '../../e2e/requests/library/contacts';

const IND_LAST = 'IndLn8535';
const IND_FIRST = 'IndFn8535';
const IND_DISPLAY = `${IND_LAST}, ${IND_FIRST}`;

const CAND_LAST = 'CandLn8535';
const CAND_FIRST = 'CandFn8535';
const CAND_DISPLAY = `${CAND_LAST}, ${CAND_FIRST}`;

// Schedule A individual receipt type (SA11AI)
const INDIVIDUAL_RECEIPT_TYPE = 'INDIVIDUAL_RECEIPT';

describe('Contacts Edit', () => {
  const updatedEmployerBase = `Updated Employer ${Date.now()}`;
  const updatedOccupationBase = `Updated Occupation ${Date.now()}`;
  let committeeDisplayName: string;
  let organizationDisplayName: string;

  beforeEach(() => {
    Initialize();

    const individualContact: MockContact = {
      ...Individual_A_A,
      last_name: IND_LAST,
      first_name: IND_FIRST,
    };

    const candidateContact: MockContact = {
      ...Candidate_House_A,
      last_name: CAND_LAST,
      first_name: CAND_FIRST,
    };

    const committeeContact: MockContact = {
      ...Committee_A,
      name: Committee_A.name,
    };

    const organizationContact: MockContact = {
      ...Organization_A,
      name: Organization_A.name,
    };

    committeeDisplayName = committeeContact.name as string;
    organizationDisplayName = organizationContact.name as string;

    makeContact(individualContact);
    makeContact(candidateContact);
    makeContact(committeeContact);
    makeContact(organizationContact);

    ContactListPage.goToPage();
  });

  xit('updates employer/occupation for an Individual and persists to list', () => {
    const updatedEmployer = `${updatedEmployerBase}-ind`;
    const updatedOccupation = `${updatedOccupationBase}-ind`;

    PageUtils.clickKababItem(IND_DISPLAY, 'Edit');

    cy.contains('Edit Contact').should('exist');
    cy.contains('h3', 'Employer').should('exist');

    cy.get('input#employer')
      .clear()
      .type(updatedEmployer);

    cy.get('input#occupation')
      .clear()
      .type(updatedOccupation);

    PageUtils.clickButton('Save');

    cy.contains('Confirm').should('exist');
    cy.contains(
      `Your suggested changes for ${IND_DISPLAY} will affect all transactions involving this contact.`,
    ).should('exist');
    cy.contains(`Updated employer to ${updatedEmployer}`).should('exist');
    cy.contains(`Updated occupation to ${updatedOccupation}`).should('exist');

    PageUtils.clickButton('Continue');

    ContactsHelpers.assertSuccessToastMessage();
    cy.contains('h1', 'Manage contacts', { matchCase: false }).should('exist');

    cy.contains('table tbody tr', IND_DISPLAY).within(() => {
      cy.contains('td', updatedEmployer).should('exist');
      cy.contains('td', updatedOccupation).should('exist');
    });
  });

  it('shows Transaction History table in the contact details view', () => {
    PageUtils.clickKababItem(IND_DISPLAY, 'Edit');

    cy.contains('Edit Contact').should('exist');

    // Scope to the Transaction history card, then the first header table
    cy.contains('h2', 'Transaction history')
      .should('exist')
      .parentsUntil('body')
      .last()
      .find('table')
      .first()
      .find('thead')
      .first()
      .within(() => {
        cy.contains('Type');
        cy.contains('Form');
        cy.contains('Report');
        cy.contains('Date');
        cy.contains('Amount');
      });
  });

  xit('prevents clearing a required ID field (Candidate ID) without validation error', () => {
    PageUtils.clickKababItem(CAND_DISPLAY, 'Edit');

    cy.contains('Edit Contact').should('exist');

    // Use get(), not contains(), for the input
    cy.get('#candidate_id').clear();

    PageUtils.clickButton('Save');

    cy.contains('Edit Contact').should('exist');
    cy.contains(/candidate id.*required|this field is required/i).should('exist');

    cy.get('#candidate_id').should(($input) => {
      const ariaInvalid = $input.attr('aria-invalid');
      if (ariaInvalid) {
        expect(ariaInvalid).to.eq('true');
      }
    });
  });
});
