import { ContactListPage } from './pages/contactListPage';
import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { defaultFormData as contactFormData } from './models/ContactFormModel';

describe('Manage contacts', () => {
  beforeEach(() => {
    LoginPage.login();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
  });

  it('Create an Individual contact', () => {
    cy.runLighthouse('contacts', 'list');

    PageUtils.clickButton('Add contact');
    const formData = { ...contactFormData };
    ContactListPage.enterFormData(formData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Edit new contact and verify form conains correct values.
    PageUtils.clickLink(`${formData['last_name']}, ${formData['first_name']}`);
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    ContactListPage.assertFormData(formData);
  });

  it('Create a Candidate contact', () => {
    PageUtils.clickButton('Add contact');

    const formData = {
      ...contactFormData,
      ...{
        contact_type: 'Candidate',
        candidate_id: 'H0VA00001',
        candidate_office: 'House',
        candidate_state: 'Virginia',
        candidate_district: '01',
      },
    };
    ContactListPage.enterFormData(formData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Edit new contact and verify form conains correct values.
    PageUtils.clickLink(`${formData['last_name']}, ${formData['first_name']}`);
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Candidate');
    ContactListPage.assertFormData(formData);
  });

  it('Create a Committee contact', () => {
    PageUtils.clickButton('Add contact');

    const formData = {
      ...contactFormData,
      ...{
        contact_type: 'Committee',
      },
    };
    ContactListPage.enterFormData(formData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Edit new contact and verify form conains correct values.
    PageUtils.clickLink(formData['name']);
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    ContactListPage.assertFormData(formData);
  });

  it('Create an Organization contact', () => {
    PageUtils.clickButton('Add contact');

    const formData = {
      ...contactFormData,
      ...{
        contact_type: 'Organization',
      },
    };
    ContactListPage.enterFormData(formData);
    PageUtils.clickButton('Save');
    cy.contains('Save').should('not.exist');

    // Edit new contact and verify form conains correct values.
    PageUtils.clickLink(formData['name']);
    cy.get('#entity_type_dropdown > div.readonly').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    ContactListPage.assertFormData(formData);
  });

  it('Empty required fields should display an error message', () => {
    PageUtils.clickButton('Add contact');
    ContactListPage.enterFormData({
      ...contactFormData,
      ...{
        last_name: '',
        first_name: '',
        street_1: '',
        city: '',
        state: '',
        zip: '',
      },
    });
    PageUtils.clickButton('Save');
    cy.get('#last_name').parent().should('contain', 'This is a required field');
    cy.get('#first_name').parent().should('contain', 'This is a required field');
    cy.get('#street_1').parent().should('contain', 'This is a required field');
    cy.get('#street_2').parent().should('not.contain', 'This is a required field');
    cy.get('#city').parent().should('contain', 'This is a required field');
    cy.get('[inputid="state"]').parent().should('contain', 'This is a required field');
    cy.get('#zip').parent().should('contain', 'This is a required field');
  });

  it('Fields with too a long string should display an error message', () => {
    PageUtils.clickButton('Add contact');
    ContactListPage.enterFormData({
      ...contactFormData,
      ...{
        last_name: '012345678901234567890123456789LONG',
        first_name: '01234567890123456789LONG',
        middle_name: '01234567890123456789LONG',
        prefix: '0123456789LONG',
        suffix: '0123456789LONG',
        street_1: '0123456789012345678901234567891234LONG',
        street_2: '0123456789012345678901234567891234LONG',
        city: '012345678901234567890123456789LONG',
        zip: '012345678LONG',
        employer: '012345678901234567890123456789012345678LONG',
        occupation: '012345678901234567890123456789012345678LONG',
      },
    });
    cy.get('#last_name').parent().should('contain', 'This field cannot contain more than 30 alphanumeric characters.');
    cy.get('#first_name').parent().should('contain', 'This field cannot contain more than 20 alphanumeric characters.');
    cy.get('#middle_name')
      .parent()
      .should('contain', 'This field cannot contain more than 20 alphanumeric characters.');
    cy.get('#prefix').parent().should('contain', 'This field cannot contain more than 10 alphanumeric characters.');
    cy.get('#suffix').parent().should('contain', 'This field cannot contain more than 10 alphanumeric characters.');
    cy.get('#street_1').parent().should('contain', 'This field cannot contain more than 34 alphanumeric characters.');
    cy.get('#street_2').parent().should('contain', 'This field cannot contain more than 34 alphanumeric characters.');
    cy.get('#city').parent().should('contain', 'This field cannot contain more than 30 alphanumeric characters.');
    cy.get('#zip').parent().should('contain', 'This field cannot contain more than 9 alphanumeric characters.');
    cy.get('#employer').parent().should('contain', 'This field cannot contain more than 38 alphanumeric characters.');
    cy.get('#occupation').parent().should('contain', 'This field cannot contain more than 38 alphanumeric characters.');
  });

  xit('Create lookup contact', () => {
    // Candidate lookup
  });

  xit('Delete contact', () => {
    // test if trash can disabled if transactions are associated with the contact
    // test actual delete when no transactions associated with contact
  });
});
