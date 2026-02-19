import { ContactFormData } from '../models/ContactFormModel';
import { PageUtils } from './pageUtils';
import { ApiUtils } from '../utils/api';
import { SmokeAliases } from '../utils/aliases';

export class ContactLookup {
  private static readonly CONTACT_LOOKUP_ALIAS_SOURCE = 'contactLookupPage';
  private static readonly autocompleteOptionSelector = [
    'li.p-autocomplete-option:not(.p-autocomplete-option-group):not(.p-disabled):not([aria-disabled="true"])',
    'li.p-autocomplete-item:not(.p-disabled):not([aria-disabled="true"])',
    '[role="option"]:not(.p-autocomplete-option-group):not([aria-disabled="true"])',
  ].join(',');

  private static readonly ESCAPE_REGEX= /[.*+?^${}()|[\]\\]/g;
  private static escapeRegExp(value: string): string {
    return value.replaceAll(ContactLookup.ESCAPE_REGEX, String.raw`\$&`);
  }

  private static typeAutocompleteSearch(
    alias: string,
    searchBoxSelector: string,
    value: string,
    index = 0,
  ) {
    ContactLookup.getAutocompleteInput(alias, searchBoxSelector, index).overwrite(value);
  }

  private static getAutocompleteInput(alias: string, searchBoxSelector: string, index = 0) {
    return cy
      .get(alias)
      .find(searchBoxSelector)
      .filter(':visible')
      .eq(index)
      .should('exist')
      .should('be.visible')
      .and('not.be.disabled');
  }

  private static pickAutocompleteOption(
    alias: string,
    searchBoxSelector: string,
    match: string,
    index = 0,
  ) {
    const matchRegex = new RegExp(ContactLookup.escapeRegExp(match), 'i');

    ContactLookup.getAutocompleteInput(alias, searchBoxSelector, index).then(($input) => {
        const id = $input.attr('id');
        const ariaControls = $input.attr('aria-controls');
        const listId = ariaControls || (id ? `${id}_list` : undefined);

        if (listId) {
          cy.get(`[id="${listId}"]`)
            .should('be.visible')
            .contains(ContactLookup.autocompleteOptionSelector, matchRegex)
            .first()
            .scrollIntoView()
            .click({ force: true });
          return;
        }

        cy.contains(ContactLookup.autocompleteOptionSelector, matchRegex)
          .first()
          .scrollIntoView()
          .click({ force: true });
      });
  }

  static getContact(name: string, alias = '', type: string | undefined = undefined, index=0) {
    alias = PageUtils.getAlias(alias);
    const searchBoxSelector = '[data-cy="searchBox"]';
    if (type !== undefined) {
      PageUtils.pSelectDropdownSetValue('#entity_type_dropdown', type, alias, index);
      cy.contains('LOOKUP').should('exist');
    }
    ContactLookup.typeAutocompleteSearch(alias, searchBoxSelector, name.slice(0, 3), index);
    ContactLookup.pickAutocompleteOption(alias, searchBoxSelector, name, index);
  }

  static getCandidate(
    contact: ContactFormData,
    _excludeFecIds: string[],
    _excludeIds: string[],
    alias = '',
    _change = false,
  ) {
    const lastName = contact['last_name'];
    if (!lastName) return;
    alias = PageUtils.getAlias(alias);
    const searchBoxSelector = '[data-cy="searchBox"]';
    const nameEntry = lastName.slice(0, 3);
    const lookupAlias = SmokeAliases.network.named(
      'CandidateLookup',
      ContactLookup.CONTACT_LOOKUP_ALIAS_SOURCE,
    );
    cy.intercept(
      {
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/contacts/candidate_lookup/'),
        query: { q: nameEntry },
      },
      {
        statusCode: 200,
        body: {
          fec_api_candidates: [],
          fecfile_candidates: [contact],
        },
      },
    ).as(lookupAlias);
    ContactLookup.typeAutocompleteSearch(alias, searchBoxSelector, nameEntry, 0);
    cy.wait(`@${lookupAlias}`).its('response.statusCode').should('eq', 200);
    ContactLookup.pickAutocompleteOption(alias, searchBoxSelector, nameEntry, 0);
  }

  static getCommittee(
    contact: ContactFormData,
    _excludeFecIds: string[] = [],
    _excludeIds: string[] = [],
    alias = '',
    type: string | undefined = undefined,
  ) {
    const name = contact['name'];
    if (!name) return;
    const nameEntry = name.slice(0, 3);
    const lookupAlias = SmokeAliases.network.named(
      'CommitteeLookup',
      ContactLookup.CONTACT_LOOKUP_ALIAS_SOURCE,
    );
    cy.intercept(
      {
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/contacts/committee_lookup/'),
        query: { q: nameEntry },
      },
      {
        statusCode: 200,
        body: {
          fec_api_committees: [],
          fecfile_committees: [contact],
        },
      },
    ).as(lookupAlias);

    this.getContact(name, alias, type);
    cy.wait(`@${lookupAlias}`).its('response.statusCode').should('eq', 200);
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
