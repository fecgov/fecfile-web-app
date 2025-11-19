import { Initialize } from '../../e2e/pages/loginPage';
import { ContactListPage } from '../../e2e/pages/contactListPage';
import { PageUtils } from '../../e2e/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';
import {
  defaultFormData as contactFormData,
  ContactFormData,
} from '../../e2e/models/ContactFormModel';

describe('Contacts Add (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('creates Individual, Candidate, Committee, and Organization (happy path)', () => {
    const uid = Cypress._.random(1000, 9999);
    const individualLast = `IndLn${uid}`;
    const individualFirst = `IndFn${uid}`;
    const individualDisplay = `${individualLast}, ${individualFirst}`;
    const candidateLast = `CandLn${uid}`;
    const candidateFirst = `CandFn${uid}`;
    const candidateDisplay = `${candidateLast}, ${candidateFirst}`;
    const candidateId = 'H0VA00001';
    const committeeName = `Committee ${uid}`;
    const committeeId = `C${String(uid).padStart(8, '0')}`;
    const orgName = `Organization ${uid}`;
    type CaseType = 'Individual' | 'Candidate' | 'Committee' | 'Organization';
    type CaseConfig = {
      label: string;
      overrides: Partial<ContactFormData>;
      rowText: string;
      type: CaseType;
      fecId?: string;
    };

    const cases: CaseConfig[] = [
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

    for (const c of cases) {
      cy.log(`Creating: ${c.label}`);
      const formData: ContactFormData = {
        ...contactFormData,
        ...c.overrides,
      };
      PageUtils.clickButton('Add contact');
      ContactListPage.enterFormData(formData);
      PageUtils.clickButton('Save');
      cy.contains('Save').should('not.exist');
      ContactsHelpers.assertSuccessToast();
    }

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.get('tbody tr').should('have.length.at.least', cases.length);
    for (const c of cases) {
      ContactsHelpers.assertRow(c.rowText, c.type, c.fecId);
    }
  });

  it('Create a Committee contact via lookup (typeahead)', () => {
    PageUtils.clickButton('Add contact');
    cy.get('#entity_type_dropdown')
      .first()
      .click();
    cy.contains('.p-select-option', 'Committee')
      .scrollIntoView({ offset: { top: 0, left: 0 } })
      .click();

    cy.get('.p-autocomplete-input')
      .should('exist')
      .clear()
      .type('ber', { delay: 50 }); // ≥3 chars

    cy.get('.p-autocomplete-option')
      .first()
      .click({ force: true });

    PageUtils.clickButton('Save');
    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('tbody tr', /committee/i)
      .should('exist')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Committee');
      });
  });

  it('Create a Candidate contact via lookup (typeahead)', () => {
    PageUtils.clickButton('Add contact');
    cy.get('#entity_type_dropdown')
      .first()
      .click();
    cy.contains('.p-select-option', 'Candidate')
      .scrollIntoView({ offset: { top: 0, left: 0 } })
      .click();

    cy.get('.p-autocomplete-input')
      .should('exist')
      .clear()
      .type('ber', { delay: 50 });

    cy.get('.p-autocomplete-option')
      .first()
      .click({ force: true });

    PageUtils.clickButton('Save');
    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.contains('tbody tr', /candidate/i)
      .should('exist')
      .within(() => {
        cy.get('td').eq(1).should('contain.text', 'Candidate');
        cy.get('td').eq(2).invoke('text').should('match', /\S/); // FEC ID not empty
      });
  });

  it('Candidate and Committee FEC ID validation fails on bad IDs', () => {
    PageUtils.clickButton('Add contact');
    ContactListPage.enterFormData({
      ...contactFormData,
      contact_type: 'Candidate',
      candidate_id: 'HX000', // invalid format
      candidate_office: 'House',
      candidate_state: 'Virginia',
      candidate_district: '01',
      last_name: 'Bad',
      first_name: 'Candidate',
    });
    PageUtils.clickButton('Save');
    cy.get('#candidate_id')
      .parent()
      .invoke('text')
      .should('match', /the id entered is not in the correct format/i);
    PageUtils.clickButton('Cancel');
    cy.contains('Save').should('not.exist');

    PageUtils.clickButton('Add contact');
    ContactListPage.enterFormData({
      ...contactFormData,
      contact_type: 'Committee',
      committee_id: 'X123', // invalid format
      name: 'Bad Committee',
    });
    PageUtils.clickButton('Save');
    cy.get('#committee_id')
      .parent()
      .invoke('text')
      .should('match', /the id entered is not in the correct format/i);
    PageUtils.clickButton('Cancel');
    cy.contains('Save').should('not.exist');
  });

  it('Cancel flow: starting Add contact and cancelling does not create rows', () => {
    cy.get('tbody', { timeout: 10000 })
      .then(($tbody) => $tbody.find('tr').length)
      .then((beforeCount) => {
        const types: ContactFormData['contact_type'][] = [
          'Individual',
          'Candidate',
          'Committee',
          'Organization',
        ];

        for (const contactType of types) {
          PageUtils.clickButton('Add contact');
          let formData: ContactFormData = {
            ...contactFormData,
            contact_type: contactType,
          };

          if (contactType === 'Individual') {
            formData = {
              ...formData,
              last_name: 'CancelLn',
              first_name: 'CancelFn',
            };
          } else if (contactType === 'Candidate') {
            formData = {
              ...formData,
              last_name: 'CancelCandLn',
              first_name: 'CancelCandFn',
              candidate_id: 'H0VA00001',
              candidate_office: 'House',
              candidate_state: 'Virginia',
              candidate_district: '01',
            };
          } else if (contactType === 'Committee') {
            formData = {
              ...formData,
              name: 'Cancel Committee',
              committee_id: 'C00000001',
            };
          } else if (contactType === 'Organization') {
            formData = {
              ...formData,
              name: 'Cancel Org',
            };
          }

          ContactListPage.enterFormData(formData);
          PageUtils.clickButton('Cancel');
          cy.contains('Save').should('not.exist');
        }

        cy.get('tbody')
          .then(($tbody) => $tbody.find('tr').length)
          .should('eq', beforeCount);
      });
  });

  it('Validation: missing required fields shows error messages', () => {
    PageUtils.clickButton('Add contact');
    ContactListPage.enterFormData({
      ...contactFormData,
      last_name: '',
      first_name: '',
      street_1: '',
      city: '',
      state: '',
      zip: '',
    });
    PageUtils.clickButton('Save');
    cy.get('#last_name').parent().should('contain', 'This is a required field');
    cy.get('#first_name').parent().should('contain', 'This is a required field');
    cy.get('#street_1').parent().should('contain', 'This is a required field');
    cy.get('#street_2').parent().should('not.contain', 'This is a required field');
    cy.get('#city').parent().should('contain', 'This is a required field');
    cy.get('[inputid="state"]').parent().should('contain', 'This is a required field');
    cy.get('#zip').parent().should('contain', 'This is a required field');
    PageUtils.clickButton('Cancel');
    cy.contains('Save').should('not.exist');
  });
});
