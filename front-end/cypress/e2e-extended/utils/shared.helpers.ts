export class SharedHelpers {
  // had issues with [5, 10, 15, 20] so I changed it to [10, 5, 15, 20] for more reliable results-per-page selection
  static readonly RESULTS_PER_PAGE_SIZES = [10, 5, 15, 20] as const;

  static paginator(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy$="-table-pagination"]').filter(':visible').first();
  }

  static openResultsPerPage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-cy$="-table-pagination-rows-per-page"]').filter(':visible').first().scrollIntoView().click({ force: true });
  }

  static chooseResultsPerPage(n: number): Cypress.Chainable<JQuery<HTMLElement>> {
    this.openResultsPerPage();
    return cy.get('[data-cy$="-table-pagination-rows-per-page-option"], [role="option"]').contains(String(n)).should('be.visible').click();
  }

  static chooseDefaultResultsPerPageOptions(): void {
    for (const size of this.RESULTS_PER_PAGE_SIZES) {
      this.chooseResultsPerPage(size);
    }
  }
}
