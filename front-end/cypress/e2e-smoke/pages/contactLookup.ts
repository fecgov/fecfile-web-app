import { ContactFormData } from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';

export class ContactLookup {
  private static readonly contactTypeSelector = '[data-cy$="-contact-type-select"], #entity_type_dropdown';
  private static readonly searchInputSelector = '[data-cy$="-contact-search-input"], [data-cy="searchBox"], input#searchBox';
  private static readonly searchOptionSelector = '[data-cy$="-contact-search-input-option"], [role="option"]';

  static getContact(name: string, alias = '', type: string | undefined = undefined, index = 0) {
    alias = PageUtils.getAlias(alias);
    if (type !== undefined) {
      PageUtils.pSelectDropdownSetValue(ContactLookup.contactTypeSelector, type, alias, index);
    }
    cy.get(alias).find(ContactLookup.searchInputSelector).eq(index).clear().type(name.slice(0, 3), { force: true });
    cy.get('body').contains(ContactLookup.searchOptionSelector, name).should('exist').click({ force: true });
  }

  static getCandidate(
    contact: ContactFormData,
    excludeFecIds: string[],
    excludeIds: string[],
    alias = '',
    change = false,
  ) {
    const lastName = contact['last_name'];
    if (!lastName) return;
    const nameEntry = lastName.slice(0, 3);
    cy.intercept(
      'GET',
      `http://localhost:8080/api/v1/contacts/candidate_lookup/?q=${nameEntry}&max_fec_results=10&max_fecfile_results=5&office=&exclude_fec_ids=${excludeFecIds.join(',')}&exclude_ids=${excludeIds.join(',')}`,
      {
        statusCode: 200,
        body: {
          fec_api_candidates: [],
          fecfile_candidates: [contact],
        },
      },
    );
    const candidateSection = cy.get(alias);
    candidateSection.find(ContactLookup.searchInputSelector).first().clear().type(nameEntry, { force: true });
    candidateSection
      .get('body')
      .contains(ContactLookup.searchOptionSelector, nameEntry)
      .then(($name) => {
        cy.wrap($name).click();
      });
  }

  static getCommittee(
    contact: ContactFormData,
    excludeFecIds: string[] = [],
    excludeIds: string[] = [],
    alias = '',
    type: string | undefined = undefined,
  ) {
    const name = contact['name'];
    if (!name) return;
    const nameEntry = name.slice(0, 3);
    cy.intercept(
      'GET',
      `http://localhost:8080/api/v1/contacts/committee_lookup/?q=${nameEntry}&max_fec_results=10&max_fecfile_results=5&exclude_fec_ids=${excludeFecIds.join(',')}&exclude_ids=${excludeIds.join(',')}`,
      {
        statusCode: 200,
        body: {
          fec_api_committees: [],
          fecfile_committees: [contact],
        },
      },
    );

    this.getContact(name, alias, type);
  }

  static setType(
    type: "Individual" | "Organization" | "Committee" | "Candidate",
    querySelector="#entity_type_dropdown",
    alias='',
    index=0,
  ) {
    PageUtils.pSelectDropdownSetValue(querySelector || ContactLookup.contactTypeSelector, type, alias, index);
  }
}
