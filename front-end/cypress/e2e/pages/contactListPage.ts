import { PageUtils } from './pageUtils';

export type ContactFormData = {
  contact_type: string;
  last_name: string;
  first_name: string;
  middle_name: string;
  prefix: string;
  suffix: string;
  country: string;
  street_1: string;
  street_2: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
  employer: string;
  occupation: string;
  candidate_id: string;
  candidate_office: string;
  candidate_state: string;
  candidate_district: string;
  committee_id: string;
  name: string;
};

export const defaultFormData: ContactFormData = {
  contact_type: 'Individual',
  last_name: PageUtils.randomString(10),
  first_name: PageUtils.randomString(10),
  middle_name: PageUtils.randomString(10),
  prefix: PageUtils.randomString(5),
  suffix: PageUtils.randomString(5),
  country: 'United States of America',
  street_1: PageUtils.randomString(10),
  street_2: PageUtils.randomString(10),
  city: PageUtils.randomString(10),
  state: 'District of Columbia',
  zip: PageUtils.randomString(5),
  phone: PageUtils.randomString(10, 'numeric'),
  employer: PageUtils.randomString(20),
  occupation: PageUtils.randomString(20),
  candidate_id: 'H2AZ12345',
  candidate_office: 'House',
  candidate_state: 'Virginia',
  candidate_district: '01',
  committee_id: 'C' + PageUtils.randomString(8, 'numeric'),
  name: PageUtils.randomString(10),
};

export class ContactListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.p-menubar').find('.p-menuitem-link').contains('Contacts').click();
  }

  static enterFormData(formData: ContactFormData) {
    PageUtils.dropdownSetValue('#entity_type_dropdown', formData['contact_type']);

    if (formData['contact_type'] == 'Individual' || formData['contact_type'] == 'Candidate') {
      //Contact
      cy.get('#last_name').safeType(formData['last_name']);
      cy.get('#first_name').safeType(formData['first_name']);
      cy.get('#middle_name').safeType(formData['middle_name']);
      cy.get('#prefix').safeType(formData['prefix']);
      cy.get('#suffix').safeType(formData['suffix']);

      //Employer
      cy.get('#employer').safeType(formData['employer']);
      cy.get('#occupation').safeType(formData['occupation']);
    }

    //Address
    cy.get('#street_1').safeType(formData['street_1']);
    cy.get('#street_2').safeType(formData['street_2']);
    cy.get('#city').safeType(formData['city']);
    cy.get('#zip').safeType(formData['zip']);
    cy.get('#telephone').safeType(formData['phone']);
    PageUtils.dropdownSetValue("p-dropdown[formcontrolname='state']", formData['state']);

    //Candidate-exclusive fields
    if (formData['contact_type'] == 'Candidate') {
      cy.get('#candidate_id').safeType(formData['candidate_id']);

      PageUtils.dropdownSetValue("p-dropdown[formcontrolname='candidate_office']", formData['candidate_office']);

      if (formData['candidate_office'] != 'Presidential') {
        PageUtils.dropdownSetValue("p-dropdown[formcontrolname='candidate_state']", formData['candidate_state']);

        if (formData['candidate_office'] == 'House') {
          PageUtils.dropdownSetValue(
            "p-dropdown[formcontrolname='candidate_district']",
            formData['candidate_district']
          );
        }
      }
    }

    if (formData['contact_type'] == 'Committee') {
      cy.get('#committee_id').safeType(formData['committee_id']);
      cy.get('#name').safeType(formData['name']);
    }

    if (formData['contact_type'] == 'Organization') {
      cy.get('#name').safeType(formData['name']);
    }
  }

  static clickNewButton() {
    cy.get('#button-contacts-new').click();
  }

  static clickSaveButton() {
    cy.contains('.p-button-primary > .p-button-label', 'Save').click();
  }

  static clickContactName(name: string) {
    cy.contains('a', name).click();
  }

  static getName(formData: ContactFormData) {
    if (formData['contact_type'] === 'Individual' || formData['contact_type'] === 'Candidate') {
      return `${formData['last_name']}, ${formData['first_name']}`;
    }
    return formData['name'];
  }

  //Deletes all reports belonging to the logged-in committee
  static deleteAllContacts() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'GET',
        url: 'http://localhost:8080/api/v1/contacts/',
        headers: {
          'x-csrftoken': cookie?.value,
        },
      }).then((resp) => {
        const contacts = resp.body.results;
        for (const contact of contacts) {
          ContactListPage.deleteContact(contact.id);
        }
      });
    });
  }

  //Deletes a single report by its ID
  static deleteContact(contactID: string) {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'DELETE',
        url: `http://localhost:8080/api/v1/contacts/${contactID}/`,
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }
}
