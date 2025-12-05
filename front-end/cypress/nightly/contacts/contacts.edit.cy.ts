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

  it('updates employer/occupation for an Individual and persists to list', () => {
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

    // Narrow to a single container that holds the Transaction history table
    cy.contains('h2', 'Transaction history')
      .should('exist')
      .parentsUntil('body')
      .last()
      .within(() => {
        cy.get('table').should('exist');
        cy.get('thead').within(() => {
          cy.contains('Type');
          cy.contains('Form');
          cy.contains('Report');
          cy.contains('Date');
          cy.contains('Amount');
        });
      });
  });

  it('prevents clearing a required ID field (Candidate ID) without validation error', () => {
    PageUtils.clickKababItem(CAND_DISPLAY, 'Edit');

    cy.contains('Edit Contact').should('exist');

    // Clear the Candidate ID using get(), not contains()
    cy.get('#candidate_id').clear();

    PageUtils.clickButton('Save');

    cy.contains('Edit Contact').should('exist');
    cy.contains(/candidate id.*required|this field is required/i).should('exist');

    // Check aria-invalid on the same input
    cy.get('#candidate_id').should(($input) => {
      const ariaInvalid = $input.attr('aria-invalid');
      if (ariaInvalid) {
        expect(ariaInvalid).to.eq('true');
      }
    });
  });

  it('requires employer/occupation for an individual with >$200 aggregate, but allows clearing after transaction is deleted', () => {
    const unique = Date.now();
    const aggContact: MockContact = {
      ...Individual_A_A,
      last_name: `AggLn${unique}`,
      first_name: `AggFn${unique}`,
    };
    const aggDisplayName = `${aggContact.last_name}, ${aggContact.first_name}`;

    let transactionId: number | string | undefined;

    // Seed the aggregate contact and >$200 Schedule A receipt via API
    makeContact(aggContact, (contactResp) => {
      const contact = contactResp.body as any;

      const today = new Date();
      const dateStr = today.toISOString().slice(0, 10); // YYYY-MM-DD

      const scheduleA = buildScheduleA(
        INDIVIDUAL_RECEIPT_TYPE,
        250, // > $200
        dateStr,
        contact,
      );

      makeTransaction(scheduleA, (txnResp) => {
        transactionId = txnResp.body.id;
      });
    });

    ContactListPage.goToPage();

    // Employer/Occupation required while there is a >$200 individual receipt
    PageUtils.clickKababItem(aggDisplayName, 'Edit');
    cy.contains('Edit Contact').should('exist');

    cy.get('input#employer').clear();
    cy.get('input#occupation').clear();

    PageUtils.clickButton('Save');

    cy.contains(/employer.*required|this field is required/i).should('exist');
    cy.contains(/occupation.*required|this field is required/i).should('exist');
    cy.contains('Edit Contact').should('exist');

    // Delete the transaction, then Employer/Occupation should no longer be required
    cy.then(() => {
      expect(transactionId, 'transaction id should be captured from create response').to.exist;
    });

    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:8080/api/v1/transactions/${transactionId}/`,
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });

    PageUtils.clickKababItem(aggDisplayName, 'Edit');
    cy.contains('Edit Contact').should('exist');

    cy.get('input#employer').clear();
    cy.get('input#occupation').clear();

    PageUtils.clickButton('Save');
    cy.contains('Confirm').should('exist');
    PageUtils.clickButton('Continue');

    cy.contains('Manage Contacts').should('exist');

    // Employer / Occupation cells should now be visually blank
    cy.contains('tbody tr', aggDisplayName).within(() => {
      cy.get('td')
        .eq(3)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.eq('');
        });

      cy.get('td')
        .eq(4)
        .invoke('text')
        .then((text) => {
          expect(text.trim()).to.eq('');
        });
    });
  });
});
