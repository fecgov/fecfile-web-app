import { StatesCodeLabels } from 'app/shared/utils/label.utils';
import {
  candidateFormData,
  committeeFormData,
  ContactFormData,
  defaultFormData as individualContactFormData,
  organizationFormData,
} from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';

export class ContactListPage {
  private static readonly inputSelectors = {
    candidateId: '[data-cy$="-candidate-id-input"], #candidate_id',
    city: '[data-cy$="-city-input"], #city',
    committeeId: '[data-cy$="-committee-id-input"], #committee_id',
    country: '[data-cy$="-country-select"], [inputid="country"]',
    employer: '[data-cy$="-employer-input"], #employer',
    firstName: '[data-cy$="-first-name-input"], #first_name',
    lastName: '[data-cy$="-last-name-input"], #last_name',
    middleName: '[data-cy$="-middle-name-input"], #middle_name',
    name: '[data-cy$="-name-input"], #name',
    occupation: '[data-cy$="-occupation-input"], #occupation',
    prefix: '[data-cy$="-prefix-input"], #prefix',
    state: '[data-cy$="-state-select"], app-searchable-select[inputid="state"]',
    street1: '[data-cy$="-street-1-input"], #street_1',
    street2: '[data-cy$="-street-2-input"], #street_2',
    suffix: '[data-cy$="-suffix-input"], #suffix',
    telephone: '[data-cy$="-telephone-input"], #telephone',
    zip: '[data-cy$="-zip-input"], #zip',
  } as const;

  private static readonly selectSelectors = {
    candidateDistrict: '[data-cy$="-candidate-district-select"], #candidate_district, app-select[inputid="candidate_district"]',
    candidateOffice: '[data-cy$="-candidate-office-select"], app-select[inputid="candidate_office"]',
    candidateState: '[data-cy$="-candidate-state-select"], app-select[inputid="candidate_state"]',
    contactType: '[data-cy$="-contact-type-select"], #entity_type_dropdown',
  } as const;

  static goToPage() {
    cy.visit('/contacts');
  }

  static enterFormData(formData: ContactFormData, excludeContactType = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (!excludeContactType) {
      PageUtils.pSelectDropdownSetValue(ContactListPage.selectSelectors.contactType, formData['contact_type'], alias);
    }

    if (formData['contact_type'] == 'Individual' || formData['contact_type'] == 'Candidate') {
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.lastName, formData['last_name']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.firstName, formData['first_name']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.middleName, formData['middle_name']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.prefix, formData['prefix']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.suffix, formData['suffix']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.employer, formData['employer']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.occupation, formData['occupation']);
    }

    ContactListPage.typeInto(alias, ContactListPage.inputSelectors.street1, formData['street_1']);
    ContactListPage.typeInto(alias, ContactListPage.inputSelectors.street2, formData['street_2']);
    ContactListPage.typeInto(alias, ContactListPage.inputSelectors.city, formData['city']);
    ContactListPage.typeInto(alias, ContactListPage.inputSelectors.zip, formData['zip']);
    ContactListPage.typeInto(alias, ContactListPage.inputSelectors.telephone, formData['phone']);
    PageUtils.pSelectDropdownSetValue(ContactListPage.inputSelectors.state, formData['state'], alias);

    if (formData['contact_type'] == 'Candidate') {
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.candidateId, formData['candidate_id']);

      ContactListPage.selectNativeDropdown(ContactListPage.selectSelectors.candidateOffice, formData['candidate_office'], alias);

      if (formData['candidate_office'] != 'Presidential') {
        ContactListPage.selectNativeDropdown(ContactListPage.selectSelectors.candidateState, formData['candidate_state'], alias);

        const singleDistrictStates = ['Alaska', 'Delaware', 'North Dakota', 'South Dakota', 'Vermont', 'Wyoming'];
        if (formData['candidate_office'] == 'House' && !singleDistrictStates.includes(formData['candidate_state'])) {
          ContactListPage.selectNativeDropdown(
            ContactListPage.selectSelectors.candidateDistrict,
            formData['candidate_district'],
            alias,
          );
        }
      }
    }

    if (formData['contact_type'] == 'Committee') {
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.committeeId, formData['committee_id']);
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.name, formData['name']);
    }

    if (formData['contact_type'] == 'Organization') {
      ContactListPage.typeInto(alias, ContactListPage.inputSelectors.name, formData['name']);
    }
  }

  static assertFormData(formData: ContactFormData, excludeCountry = false, alias = '') {
    alias = PageUtils.getAlias(alias);

    if (['Individual', 'Candidate'].includes(formData['contact_type'])) {
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.lastName, formData['last_name']);
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.firstName, formData['first_name']);
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.middleName, formData['middle_name'] ?? '');
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.prefix, formData['prefix'] ?? '');
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.suffix, formData['suffix'] ?? '');
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.employer, formData['employer'] ?? '');
      ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.occupation, formData['occupation'] ?? '');
    }

    if (!excludeCountry) {
      cy.get(alias).find(ContactListPage.inputSelectors.country).first().should('contain', formData['country']);
    }
    ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.street1, formData['street_1']);
    ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.street2, formData['street_2'] ?? '');
    ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.city, formData['city']);
    const state =
      formData['state'].length === 2 ? StatesCodeLabels.find((f) => f[0] === formData['state'])![1] : formData['state'];
    cy.get(alias).find(ContactListPage.inputSelectors.state).first().should('contain', state);
    ContactListPage.shouldHaveValue(alias, ContactListPage.inputSelectors.zip, formData['zip']);

    if (formData['contact_type'] === 'Candidate') {
      cy.get(alias).find(ContactListPage.selectSelectors.candidateOffice).first().find('option:selected').should('contain', formData['candidate_office']);
      cy.get(alias).find(ContactListPage.selectSelectors.candidateState).first().find('option:selected').should('contain', formData['candidate_state']);
      cy.get(alias).find(ContactListPage.selectSelectors.candidateDistrict).first().should('contain', formData['candidate_district']);
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
    PageUtils.clickButton('Add contact');
    cy.wait(150);
    ContactListPage.enterFormData(fd);
    PageUtils.clickButton('Save');
  }

  private static typeInto(alias: string, selector: string, value?: string | number | null) {
    cy.get(alias).find(selector).first().safeType(value ?? '');
  }

  private static shouldHaveValue(alias: string, selector: string, value: string) {
    cy.get(alias).find(selector).first().should('have.value', value);
  }

  private static selectNativeDropdown(selector: string, value: string, alias: string) {
    if (!value) return;

    cy.get(alias)
      .find(selector)
      .first()
      .contains('option', value)
      .then((option) => {
        cy.get(alias).find(selector).first().select(option.val()!, { force: true });
      });
  }
}
