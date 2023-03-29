import { LoginPage } from './pages/loginPage';
import { defaultFormData, ContactListPage } from './pages/contactListPage';

describe('Manage contacts', () => {
  beforeEach(() => {
    LoginPage.login();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
  });

  it('Create an Individual contact', () => {
    ContactListPage.clickNewButton();
    const formData = { ...defaultFormData };
    ContactListPage.enterFormData(formData);
    ContactListPage.clickSaveButton();
    cy.contains('a', ContactListPage.getName(formData)).should('exist');

    // Edit new contact and verify form conains correct values.
    ContactListPage.clickContactName(ContactListPage.getName(formData));
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Individual');
    cy.get('#last_name').should('have.value', formData['last_name']);
    cy.get('#first_name').should('have.value', formData['first_name']);
    cy.get('#middle_name').should('have.value', formData['middle_name']);
    cy.get('#prefix').should('have.value', formData['prefix']);
    cy.get('#suffix').should('have.value', formData['suffix']);
    cy.get('[inputid="country"]').should('contain', formData['country']);
    cy.get('#street_1').should('have.value', formData['street_1']);
    cy.get('#street_2').should('have.value', formData['street_2']);
    cy.get('#city').should('have.value', formData['city']);
    cy.get('[inputid="state"]').should('contain', formData['state']);
    cy.get('#zip').should('have.value', formData['zip']);
    cy.get('#employer').should('have.value', formData['employer']);
    cy.get('#occupation').should('have.value', formData['occupation']);
  });

  it('Create a Candidate contact', () => {
    ContactListPage.clickNewButton();

    const formData = {
      ...defaultFormData,
      ...{
        contact_type: 'Candidate',
      },
    };
    ContactListPage.enterFormData(formData);
    ContactListPage.clickSaveButton();
    cy.contains('a', ContactListPage.getName(formData)).should('exist');

    // Edit new contact and verify form conains correct values.
    ContactListPage.clickContactName(ContactListPage.getName(formData));
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Candidate');
    // cy.get('#candidate_id').should('contain', formData['candidate_id']);
    cy.get('#last_name').should('have.value', formData['last_name']);
    cy.get('#first_name').should('have.value', formData['first_name']);
    cy.get('#middle_name').should('have.value', formData['middle_name']);
    cy.get('#prefix').should('have.value', formData['prefix']);
    cy.get('#suffix').should('have.value', formData['suffix']);
    cy.get('[inputid="country"]').should('contain', formData['country']);
    cy.get('#street_1').should('have.value', formData['street_1']);
    cy.get('#street_2').should('have.value', formData['street_2']);
    cy.get('#city').should('have.value', formData['city']);
    cy.get('[inputid="state"]').should('contain', formData['state']);
    cy.get('#zip').should('have.value', formData['zip']);
    cy.get('#employer').should('have.value', formData['employer']);
    cy.get('#occupation').should('have.value', formData['occupation']);
    cy.get('[inputid="candidate_office"]').should('contain', formData['candidate_office']);
    cy.get('[inputid="candidate_state"]').should('contain', formData['candidate_state']);
    cy.get('[inputid="candidate_district"]').should('contain', formData['candidate_district']);
  });

  it('Create a Committee contact', () => {
    ContactListPage.clickNewButton();

    const formData = {
      ...defaultFormData,
      ...{
        contact_type: 'Committee',
      },
    };
    ContactListPage.enterFormData(formData);
    ContactListPage.clickSaveButton();
    cy.contains('a', ContactListPage.getName(formData)).should('exist');

    // Edit new contact and verify form conains correct values.
    ContactListPage.clickContactName(ContactListPage.getName(formData));
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Committee');
    // cy.get('#committee_id').should('contain', formData['committee_id']);
    // cy.get('#name').should('contain', formData['name']);
    cy.get('[inputid="country"]').should('contain', formData['country']);
    cy.get('#street_1').should('have.value', formData['street_1']);
    cy.get('#street_2').should('have.value', formData['street_2']);
    cy.get('#city').should('have.value', formData['city']);
    cy.get('[inputid="state"]').should('contain', formData['state']);
    cy.get('#zip').should('have.value', formData['zip']);
  });

  it('Create an Organization contact', () => {
    ContactListPage.clickNewButton();

    const formData = {
      ...defaultFormData,
      ...{
        contact_type: 'Organization',
      },
    };
    ContactListPage.enterFormData(formData);
    ContactListPage.clickSaveButton();
    cy.contains('a', ContactListPage.getName(formData)).should('exist');

    // Edit new contact and verify form conains correct values.
    ContactListPage.clickContactName(ContactListPage.getName(formData));
    cy.get('#entity_type_dropdown > div.p-disabled').should('exist');
    cy.get('#entity_type_dropdown').should('contain', 'Organization');
    // cy.get('#name').should('contain', formData['name']);
    cy.get('[inputid="country"]').should('contain', formData['country']);
    cy.get('#street_1').should('have.value', formData['street_1']);
    cy.get('#street_2').should('have.value', formData['street_2']);
    cy.get('#city').should('have.value', formData['city']);
    cy.get('[inputid="state"]').should('contain', formData['state']);
    cy.get('#zip').should('have.value', formData['zip']);
  });

  it('Empty required fields should display an error message', () => {
    ContactListPage.clickNewButton();
    const formData = {
      ...defaultFormData,
      ...{
        last_name: '',
        first_name: '',
        street_1: '',
        city: '',
        state: '',
        zip: '',
      },
    };
    ContactListPage.enterFormData(formData);
    ContactListPage.clickSaveButton();
    cy.get('#last_name').parent().should('contain', 'This is a required field');
    cy.get('#first_name').parent().should('contain', 'This is a required field');
    cy.get('#street_1').parent().should('contain', 'This is a required field');
    cy.get('#street_2').parent().should('not.contain', 'This is a required field');
    cy.get('#city').parent().should('contain', 'This is a required field');
    cy.get('[inputid="state"]').parent().should('contain', 'This is a required field');
    cy.get('#zip').parent().should('contain', 'This is a required field');
  });

  it('Fields with too a long string should display an error message', () => {
    ContactListPage.clickNewButton();
    const formData = {
      ...defaultFormData,
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
    };
    ContactListPage.enterFormData(formData);
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
