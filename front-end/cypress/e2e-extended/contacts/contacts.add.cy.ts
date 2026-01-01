import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactListPage } from '../../e2e-smoke/pages/contactListPage';
import { PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ContactsHelpers } from './contacts.helpers';
import {
  defaultFormData as contactFormData,
  candidateFormData,
  committeeFormData,
  organizationFormData,
  ContactFormData,
} from '../../e2e-smoke/models/ContactFormModel';

const resolveBaseFormData = (
  type: ContactFormData['contact_type'],
): ContactFormData => {
  switch (type) {
    case 'Candidate':
      return candidateFormData;
    case 'Committee':
      return committeeFormData;
    case 'Organization':
      return organizationFormData;
    default:
      return contactFormData;
  }
};

const buildFormDataForType = (
  type: ContactFormData['contact_type'],
  overrides: Partial<ContactFormData>,
): ContactFormData => {
  const base = resolveBaseFormData(type);

  return {
    ...base,
    ...overrides,
    contact_type: type,
  };
};

describe('Contacts Add (/contacts)', () => {
  beforeEach(() => {
    Initialize();
    ContactListPage.goToPage();
  });

  it('creates Individual, Candidate, Committee, and Organization (happy path)', () => {
    const uid = Cypress._.random(1000, 9999);
    const cases = ContactsHelpers.buildContactTypeCases(uid);

    PageUtils.clickButton('Add contact');
    for (const c of cases) {
      cy.log(`Creating: ${c.label}`);
      const formData = buildFormDataForType(c.type, c.overrides);
      ContactListPage.enterFormData(formData);
      PageUtils.clickButton('Save & Add More');
      ContactsHelpers.assertSuccessToastMessage();
    }

    ContactListPage.goToPage();
    ContactsHelpers.assertColumnHeaders(ContactsHelpers.CONTACTS_HEADERS);
    cy.get('tbody tr').should('have.length.at.least', cases.length);
    for (const c of cases) {
      if (c.type==='Candidate' || c.type==='Committee') {ContactsHelpers.assertRowValues(c.rowText, c.type.slice(0, 3).toUpperCase(), c.fecId);
      } else {
        ContactsHelpers.assertRowValues(c.rowText, c.type.slice(0, 3).toUpperCase());
      }
    }
  });

  it('Create a Committee contact via lookup', () => {
    ContactsHelpers.createContactViaLookup(
      'Committee',
      '**/api/v1/contacts/committee/?committee_id=*',
      /committee/i,
    ).within(() => {
      cy.get('td').eq(1).should('contain.text', 'COM');
    });
  });

  it('Create a Candidate contact via lookup', () => {
    ContactsHelpers.createContactViaLookup(
      'Candidate',
      '**/api/v1/contacts/candidate/?candidate_id=*',
      /candidate/i,
    ).within(() => {
      cy.get('td').eq(1).should('contain.text', 'CAN');
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

  it('Save & Add More: chains Individual, Candidate, Committee, and Organization', () => {
    const uid = Cypress._.random(1000, 9999);
    const cases = ContactsHelpers.buildContactTypeCases(uid);

    cy.intercept(
      'GET',
      '**/api/v1/contacts/?page=1&ordering=sort_name&page_size=10',
    ).as('contactsReload');

    cy.get('tbody', { timeout: 5000 })
      .then(($tbody) => $tbody.find('tr').length)
      .then((beforeCount) => {
        PageUtils.clickButton('Add contact');

        for (const c of cases) {
          cy.log(`Creating via Save & Add More: ${c.label}`);
          const formData = buildFormDataForType(c.type, c.overrides);

          ContactListPage.enterFormData(formData);
          PageUtils.clickButton('Save & Add More');
          ContactsHelpers.assertSuccessToastMessage();

          cy.contains('button', 'Save & Add More').should('exist');
          cy.contains('button', 'Save').should('exist');

          // keep your reset checks
          if (c.type === 'Individual' || c.type === 'Candidate') {
            cy.get('#last_name').should('have.value', '');
            cy.get('#first_name').should('have.value', '');
          } else {
            cy.get('#name').should('have.value', '');
          }
          cy.get('#street_1').should('have.value', '');
          cy.get('#city').should('have.value', '');
          cy.get('#zip').should('have.value', '');
          if (c.type === 'Candidate') {
            cy.get('#candidate_id').should('have.value', '');
          }
          if (c.type === 'Committee') {
            cy.get('#committee_id').should('have.value', '');
          }
        }

        PageUtils.clickButton('Cancel');
        cy.contains('Save').should('not.exist');

        ContactListPage.goToPage();
        cy.wait('@contactsReload');
        cy.get('tbody tr').should('have.length', beforeCount + cases.length);

        for (const c of cases) {
          ContactsHelpers.assertRowValues(c.rowText, c.type.slice(0, 3).toUpperCase(), c.fecId);
        }
      });
  });
});
