import { PageUtils } from '../../e2e-smoke/pages/pageUtils';

export class SharedHelpers {
  // had issues with [5, 10, 15, 20] so I changed it to [10, 5, 15, 20] for more reliable results-per-page selection
  static readonly RESULTS_PER_PAGE_SIZES = [10, 5, 15, 20] as const;

  static paginator(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('p-paginator, .p-paginator').first();
  }

  static openResultsPerPage(): Cypress.Chainable<JQuery<HTMLElement>> {
    const overlaySelector = '.p-select-overlay:visible, .p-select-panel:visible, .p-dropdown-panel:visible, .p-overlay:visible';

    return cy
      .contains(/results\s*per\s*page/i)
      .parent()
      .as('rppWrap')
      .then(() => {
        // Click the paginator select control (PrimeNG p-select or p-dropdown)
        cy.get('@rppWrap')
          .find('p-select, .p-select, p-dropdown, .p-dropdown, [role="combobox"], [aria-haspopup="listbox"]')
          .filter(':visible')
          .first()
          .scrollIntoView()
          .click({ force: true });
      })
      .then(() => cy.get(overlaySelector, { timeout: 10000 }).filter(':visible').last());
  }

  static chooseResultsPerPage(n: number): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy
      .contains(/results\s*per\s*page/i)
      .parent()
      .as('rppWrap')
      .then(() => {
        // Use PageUtils.dropdownSetValue to handle overlays and filterable lists.
        PageUtils.dropdownSetValue('p-select, .p-select, p-dropdown, .p-dropdown', String(n), '@rppWrap');

        // Confirm label updates (this prevents false-clicks where the option is clicked
        // but the component doesn't update).
        cy.get('@rppWrap')
          .find(
            'p-select [data-pc-section="label"], p-select .p-select-label, .p-dropdown-label, [data-pc-section="label"]',
          )
          .filter(':visible')
          .first()
          .should('contain.text', String(n));
      })
      .then(() => cy.get('@rppWrap'));
  }

  static chooseDefaultResultsPerPageOptions(): void {
    for (const size of this.RESULTS_PER_PAGE_SIZES) {
      this.chooseResultsPerPage(size);
    }
  }
}
