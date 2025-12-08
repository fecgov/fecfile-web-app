import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { currentYear, PageUtils } from '../../e2e/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';

import { makeContact, makeF3x } from '../../e2e/requests/methods';
import { F3X_Q2 } from '../../e2e/requests/library/reports';
import { Individual_A_A, MockContact } from '../../e2e/requests/library/contacts';

import { ReportListPage } from '../../e2e/pages/reportListPage';
import { StartTransaction } from '../../e2e/F3X/utils/start-transaction/start-transaction';
import { ContactLookup } from '../../e2e/pages/contactLookup';
import {
  defaultScheduleFormData,
  ScheduleFormData,
} from '../../e2e/models/TransactionFormModel';
import { TransactionDetailPage } from '../../e2e/pages/transactionDetailPage';

describe('Contacts ↔ Transactions integration', () => {
  beforeEach(() => {
    Initialize();
  });

  it('creating an Individual receipt transaction w/ aggregate >$200 updates contact employer and occupation', () => {
    const unique = Date.now();
    const lastName = `TxnLn${unique}`;
    const firstName = `TxnFn${unique}`;
    const displayName = `${lastName}, ${firstName}`;
    const newEmployer = `Employer-${unique}`;
    const newOccupation = `Occupation-${unique}`;

    // Seed contact (employer/occupation empty) via API
    const contactPayload: MockContact & {
      employer?: string | null;
      occupation?: string | null;
    } = {
      ...Individual_A_A,
      last_name: lastName,
      first_name: firstName,
      employer: '',
      occupation: '',
    };

    makeContact(contactPayload);

    // Seed F3X report via API
    let reportId: string | undefined;
    makeF3x(F3X_Q2, (resp) => {
      reportId = resp.body.id;
    });

    cy.then(() => {
      expect(reportId, 'F3X report id should be defined').to.exist;
      cy.intercept(
        'GET',
        '**/api/v1/transactions/previous/entity/**',
      ).as('getPrevAggregate');

      ReportListPage.goToReportList(reportId as string);
      StartTransaction.Receipts().Individual().IndividualReceipt();
      cy.contains('Individual Receipt').should('exist');
      ContactLookup.getContact(lastName);

      // Fill out date received and amount (> $200 aggregate)
      const scheduleData: ScheduleFormData = {
        ...defaultScheduleFormData,
        ...{
          amount: 250.0,
          electionYear: undefined,
          electionType: undefined,
          date_received: new Date(currentYear, 4 - 1, 27),
          purpose_description: '',
          memo_text: '',
        },
      };

      TransactionDetailPage.enterScheduleFormData(
        scheduleData,
        false,
        '',
        false,
        'contribution_date',
      );
      cy.wait('@getPrevAggregate');

      // Assert Employer/Occupation are initially blank
      cy.get('#employer').should('have.value', '');
      cy.get('#occupation').should('have.value', '');
      cy.contains('button', 'Save').scrollIntoView();
      // Blank save should trigger validation errors
      PageUtils.clickButton('Save');
      cy.wait('@getPrevAggregate').should('have.status', 404);
      cy.url().should('include', `report/${reportId}/create/INDIVIDUAL_RECEIPT`).then(() => {
        cy.contains(/employer.*required|this is a required field\./i, {
          timeout: 10000,
        }).should('exist');

        cy.contains(/occupation.*required|this is a required field\./i, {
          timeout: 10000,
        }).should('exist');
      });

      cy.get('#employer').type(newEmployer);
      cy.get('#occupation').type(newOccupation);
      PageUtils.clickButton('Save');

      // Confirm modal appears and we validate its text in detail
      cy.get('.p-dialog, .p-confirm-dialog')
        .last()
        .within(() => {
          cy.contains(/^Confirm$/).should('exist');
          cy.contains(/Your suggested changes for/i)
            .invoke('text')
            .then((raw) => {
              const normalized = raw.replace(/\s+/g, ' ').trim();
              const expectedSentence = `Your suggested changes for ${displayName} will affect all transactions involving this contact.`;
              expect(normalized).to.eq(expectedSentence);
            });

          cy.contains(/^Change\(s\):$/).should('exist');
          cy.contains(`Updated employer to ${newEmployer}`).should('exist');
          cy.contains(`Updated occupation to ${newOccupation}`).should('exist');
          PageUtils.clickButton('Continue');
        });

      // Verify transaction shows up on transaction page
      cy.contains('tbody tr', 'Individual Receipt')
        .should('contain.text', displayName)
        .and('contain.text', `$${scheduleData.amount.toFixed(2)}`);

      // Verify contact row updated
      ContactListPage.goToPage();
      ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);

      cy.contains('tbody tr', displayName)
        .should('exist')
        .within(() => {
          // [Name, Type, FEC ID, Employer, Occupation, Actions]
          cy.get('td').eq(3).should('contain.text', newEmployer);
          cy.get('td').eq(4).should('contain.text', newOccupation);
        });

      // Edit contact: verify Employer/Occupation, Transaction History
      PageUtils.clickKababItem(displayName, 'Edit');
      cy.contains(/Edit Contact/i).should('exist');

      cy.get('#employer').should('have.value', newEmployer);
      cy.get('#occupation').should('have.value', newOccupation);

      cy.contains('h2', 'Transaction history')
        .scrollIntoView()
        .should('exist')
        .parentsUntil('body')
        .last()
        .find('table')
        .first()
        .within(() => {
          cy.contains('Type').should('exist');
          cy.contains('Form').should('exist');
          cy.contains('Report').should('exist');
          cy.contains('Date').should('exist');
          cy.contains('Amount').should('exist');

          cy.contains('tbody tr', 'Individual Receipt')
            .should('contain.text', `$${scheduleData.amount.toFixed(2)}`)
            .and('contain.text', displayName);
        });
    });
  });
});
