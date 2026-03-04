import { ContactFormData } from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';

export class ContactLookup {
  private static readonly autocompleteInputSelector =
    '[data-cy="searchBox"] input.p-autocomplete-input:visible:not([readonly]):not([disabled])';

  static getContact(name: string, alias = '', type: string | undefined = undefined, index=0) {
    alias = PageUtils.getAlias(alias);
    if (type !== undefined) {
      PageUtils.pSelectDropdownSetValue('#entity_type_dropdown', type, alias, index);
      cy.contains('LOOKUP').should('exist');
    }
    cy.get(alias)
      .find(this.autocompleteInputSelector)
      .eq(index)
      .clear()
      .type(name.slice(0, 3));
    cy.get('.p-autocomplete-list-container:visible')
      .contains('.p-autocomplete-option', name)
      .first()
      .click();
  }

  static getCandidate(
    contact: ContactFormData,
    excludeFecIds: string[],
    excludeIds: string[],
    alias = '',
    _change = false,
  ) {
    void _change;
    const lastName = contact['last_name'];
    if (!lastName) return;
    alias = PageUtils.getAlias(alias);
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
    cy.get(alias).find(this.autocompleteInputSelector).first().clear().type(nameEntry);
    cy.get('.p-autocomplete-list-container:visible')
      .contains('.p-autocomplete-option', nameEntry)
      .first()
      .click();
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
    PageUtils.pSelectDropdownSetValue(querySelector, type, alias, index);
  }
}
