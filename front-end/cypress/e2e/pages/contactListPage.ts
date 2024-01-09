import { ContactFormData } from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';

export class ContactListPage {
  static goToPage() {
    cy.visit('/dashboard');
    cy.get('.navbar-nav').find('.nav-link').contains('Contacts').click();
  }

  static enterFormData(formData: ContactFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (!excludeContactType) {
      PageUtils.dropdownSetValue('#entity_type_dropdown', formData['contact_type'], alias);
    }

    if (formData['contact_type'] == 'Individual' || formData['contact_type'] == 'Candidate') {
      //Contact
      cy.get(alias).find('#last_name').safeType(formData['last_name']);
      cy.get(alias).find('#first_name').safeType(formData['first_name']);
      cy.get(alias).find('#middle_name').safeType(formData['middle_name']);
      cy.get(alias).find('#prefix').safeType(formData['prefix']);
      cy.get(alias).find('#suffix').safeType(formData['suffix']);

      //Employer
      cy.get(alias).find('#employer').safeType(formData['employer']);
      cy.get(alias).find('#occupation').safeType(formData['occupation']);
    }

    //Address
    cy.get(alias).find('#street_1').safeType(formData['street_1']);
    cy.get(alias).find('#street_2').safeType(formData['street_2']);
    cy.get(alias).find('#city').safeType(formData['city']);
    cy.get(alias).find('#zip').safeType(formData['zip']);
    cy.get(alias).find('#telephone').safeType(formData['phone']);
    PageUtils.dropdownSetValue("p-dropdown[formcontrolname='state']", formData['state'], alias);

    //Candidate-exclusive fields
    if (formData['contact_type'] == 'Candidate') {
      cy.get(alias).find('#candidate_id').safeType(formData['candidate_id']);

      PageUtils.dropdownSetValue("p-dropdown[inputid='candidate_office']", formData['candidate_office'], alias);

      if (formData['candidate_office'] != 'Presidential') {
        PageUtils.dropdownSetValue("p-dropdown[inputid='candidate_state']", formData['candidate_state'], alias);

        if (formData['candidate_office'] == 'House') {
          PageUtils.dropdownSetValue("p-dropdown[inputid='candidate_district']", formData['candidate_district'], alias);
        }
      }
    }

    if (formData['contact_type'] == 'Committee') {
      cy.get(alias).find('#committee_id').safeType(formData['committee_id']);
      cy.get(alias).find('#name').safeType(formData['name']);
    }

    if (formData['contact_type'] == 'Organization') {
      cy.get(alias).find('#name').safeType(formData['name']);
    }
  }

  static assertFormData(formData: ContactFormData, excludeCountry = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (['Individual', 'Candidate'].includes(formData['contact_type'])) {
      cy.get(alias).find('#last_name').should('have.value', formData['last_name']);
      cy.get(alias).find('#first_name').should('have.value', formData['first_name']);
      cy.get(alias).find('#middle_name').should('have.value', formData['middle_name']);
      cy.get(alias).find('#prefix').should('have.value', formData['prefix']);
      cy.get(alias).find('#suffix').should('have.value', formData['suffix']);
      cy.get(alias).find('#employer').should('have.value', formData['employer']);
      cy.get(alias).find('#occupation').should('have.value', formData['occupation']);
    }

    if (!excludeCountry) {
      cy.get(alias).find('[inputid="country"]').should('contain', formData['country']);
    }
    cy.get(alias).find('#street_1').should('have.value', formData['street_1']);
    cy.get(alias).find('#street_2').should('have.value', formData['street_2']);
    cy.get(alias).find('#city').should('have.value', formData['city']);
    cy.get(alias).find('[inputid="state"]').should('contain', formData['state']);
    cy.get(alias).find('#zip').should('have.value', formData['zip']);

    if (formData['contact_type'] === 'Candidate') {
      // cy.get(alias).find('#candidate_id').should('contain', formData['candidate_id']);
      cy.get(alias).find('[inputid="candidate_office"]').should('contain', formData['candidate_office']);
      cy.get(alias).find('[inputid="candidate_state"]').should('contain', formData['candidate_state']);
      cy.get(alias).find('[inputid="candidate_district"]').should('contain', formData['candidate_district']);
    }

    if (formData['contact_type'] === 'Committee') {
      // cy.get(alias).find('#committee_id').should('contain', formData['committee_id']);
    }

    if (['Committee', 'Organization'].includes(formData['contact_type'])) {
      // cy.get(alias).find('#name').should('contain', formData['name']);
    }
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
