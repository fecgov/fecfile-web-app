import { StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  candidateFormData,
  committeeFormData,
  ContactFormData,
  defaultFormData as individualContactFormData,
  organizationFormData,
} from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';
import { ContactsHelpers } from '../../e2e-extended/contacts/contacts.helpers';

export class ContactListPage {

  static goToPage() {
    cy.visit('/contacts');
    cy.waitForNetworkIdle('GET', '*.js', 2000)
  }

  static openAddContactDialog() {
    cy.get('[data-cy="contact-dialog"]:visible').should('not.exist');
    cy.get('#button-contacts-new:enabled')
      .should('be.visible')
      .click();
    cy.get('[data-cy="contact-dialog"]:visible')
      .should('exist')
      .and('contain', 'Add Contact');
  }

  static enterFormData(formData: ContactFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (!excludeContactType) {
      PageUtils.pSelectDropdownSetValue('#entity_type_dropdown', formData['contact_type'], alias);
    }

    if (formData['contact_type'] == 'Individual' || formData['contact_type'] == 'Candidate') {
      //Contact
      cy.get(alias).find('#last_name').clear().safeType(formData['last_name']).blur();
      cy.get(alias).find('#first_name').clear().safeType(formData['first_name']).blur();
      cy.get(alias).find('#middle_name').clear().safeType(formData['middle_name']).blur();
      cy.get(alias).find('#prefix').clear().safeType(formData['prefix']).blur();
      cy.get(alias).find('#suffix').clear().safeType(formData['suffix']).blur();

      //Employer
      cy.get(alias).find('#employer').clear().safeType(formData['employer']).blur();
      cy.get(alias).find('#occupation').clear().safeType(formData['occupation']).blur();
    }

    //Address
    cy.get(alias).find('#street_1').clear().safeType(formData['street_1']).blur();
    cy.get(alias).find('#street_2').clear().safeType(formData['street_2']).blur();
    cy.get(alias).find('#city').clear().safeType(formData['city']).blur();
    cy.get(alias).find('#zip').clear().safeType(formData['zip']).blur();
    cy.get(alias).find('#telephone').scrollIntoView().clear().safeType(formData['phone']).blur();
    ContactsHelpers.setState(formData['state'], alias);


    //Candidate-exclusive fields
    if (formData['contact_type'] == 'Candidate') {
      cy.get(alias).find('#candidate_id').clear().safeType(formData['candidate_id']).blur();

      PageUtils.pSelectDropdownSetValue("app-select[inputid='candidate_office']", formData['candidate_office'], alias);

      if (formData['candidate_office'] != 'Presidential') {
        PageUtils.pSelectDropdownSetValue(
          "app-select[inputid='candidate_state']",
          formData['candidate_state'],
          alias,
        );

        const singleDistrictStates = ['Alaska', 'Delaware', 'North Dakota', 'South Dakota', 'Vermont', 'Wyoming'];
        if (formData['candidate_office'] == 'House' && !singleDistrictStates.includes(formData['candidate_state'])) {
          PageUtils.pSelectDropdownSetValue("app-select[inputid='candidate_district']", formData['candidate_district'], alias);
        }
      }
    }

    if (formData['contact_type'] == 'Committee') {
      cy.get(alias).find('#committee_id').safeType(formData['committee_id']).blur();
      cy.get(alias).find('#name').safeType(formData['name']).blur();
    }

    if (formData['contact_type'] == 'Organization') {
      cy.get(alias).find('#name').safeType(formData['name']).blur();
    }
  }

  static assertFormData(formData: ContactFormData, excludeCountry = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (['Individual', 'Candidate'].includes(formData['contact_type'])) {
      cy.get(alias).find('#last_name').should('have.value', formData['last_name']);
      cy.get(alias).find('#first_name').should('have.value', formData['first_name']);
      cy.get(alias)
        .find('#middle_name')
        .should('have.value', formData['middle_name'] ?? '');
      cy.get(alias)
        .find('#prefix')
        .should('have.value', formData['prefix'] ?? '');
      cy.get(alias)
        .find('#suffix')
        .should('have.value', formData['suffix'] ?? '');
      cy.get(alias)
        .find('#employer')
        .should('have.value', formData['employer'] ?? '');
      cy.get(alias)
        .find('#occupation')
        .should('have.value', formData['occupation'] ?? '');
    }

    if (!excludeCountry) {
      cy.get(alias).find('[inputid="country"]').should('contain', formData['country']);
    }
    cy.get(alias).find('#street_1').should('have.value', formData['street_1']);
    cy.get(alias)
      .find('#street_2')
      .should('have.value', formData['street_2'] ?? '');
    cy.get(alias).find('#city').should('have.value', formData['city']);
    const state =
      formData['state'].length === 2 ? StatesCodeLabels.find((f) => f[0] === formData['state'])![1] : formData['state'];
    cy.get(alias).find('[inputid="state"]').should('contain', state);
    cy.get(alias).find('#zip').should('have.value', formData['zip']);

    if (formData['contact_type'] === 'Candidate') {
      cy.get(alias).find('[inputid="candidate_office"]').should('contain', formData['candidate_office']);
      cy.get(alias).find('[inputid="candidate_state"]').should('contain', formData['candidate_state']);
      cy.get(alias).find('[inputid="candidate_district"]').should('contain', formData['candidate_district']);
    }
  }

  //Deletes all contacts belonging to the logged-in committee
  static deleteAllContacts() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/contacts/e2e-delete-all-contacts/',
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }

  static createIndividual(fd = individualContactFormData) {
    fd.contact_type = 'Individual';
    ContactListPage.create(fd);
  }

  static createOrganization(fd = organizationFormData) {
    ContactListPage.create(fd);
  }

  static createCandidate(fd = candidateFormData) {
    ContactListPage.create(fd);
  }

  static createCommittee(fd = committeeFormData) {
    ContactListPage.create(fd);
  }

  private static create(fd: ContactFormData) {
    ContactListPage.goToPage();
    ContactListPage.openAddContactDialog();
    ContactListPage.enterFormData(fd);
    ContactListPage.clickSave();
  }

  static clickCancel() {
    PageUtils.clickButton('Cancel', '[data-cy="contact-dialog"] [data-cy="cancel"]:visible');
  }
  static clickSave() {
    cy.get(PageUtils.getAlias(ContactsHelpers.CONTACT_DIALOG)).click('topLeft');
    PageUtils.clickButton('Save', '[data-cy="contact-dialog"] [data-cy="save"]:visible');
  }
  static clickSaveAndContinue() {
    cy.get(PageUtils.getAlias(ContactsHelpers.CONTACT_DIALOG)).click('topLeft');
    PageUtils.clickButton('Save & continue', '[data-cy="contact-dialog"] [data-cy="save-continue"]:visible');
  }
  static clickSaveAndAddMore() {
    cy.get(PageUtils.getAlias(ContactsHelpers.CONTACT_DIALOG)).click('topLeft');
    PageUtils.clickButton('Save & Add More', '[data-cy="contact-dialog"] [data-cy="save-add-more"]:visible');
  }
}
