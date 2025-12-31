import { ContactFormData } from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';

export class ContactLookup {
  static getContact(name: string, alias = '', type: string | undefined = undefined, index=0) {
    alias = PageUtils.getAlias(alias);
    if (type !== undefined) {
      PageUtils.dropdownSetValue('#entity_type_dropdown', type, alias, index);
      cy.contains('LOOKUP').should('exist');
    }
    cy.get(alias).find('[data-cy="searchBox"]').eq(index).type(name.slice(0, 3));
    cy.contains(name).should('exist').as('contactName');
    cy.get('@contactName').click({ force: true });
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
          fec_api_candidates: [contact],
          fecfile_candidates: [contact],
        },
      },
    );
    const candidateSection = cy.get(alias);
    candidateSection.find('[data-cy="searchBox"]').type(nameEntry);
    candidateSection
      .get('.p-autocomplete-list-container')
      .contains(nameEntry)
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
          fec_api_committees: [contact],
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
    PageUtils.dropdownSetValue(querySelector, type, alias, index);
  }
}
