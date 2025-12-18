export class SharedHelpers {
  static readonly RESULTS_PER_PAGE_SIZES = [5, 10, 15, 20] as const;

  static paginator(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.get('p-paginator, .p-paginator').first();
  }

  static openResultsPerPage(): Cypress.Chainable<JQuery<HTMLElement>> {
    return cy.contains(/results\s*per\s*page/i).parent().then(($wrap) => {
      const $label = $wrap.find('p-select [data-pc-section="label"], p-select .p-select-label').filter(':visible').first();
      if ($label.length) return cy.wrap($label).scrollIntoView().click();

      const $root = $wrap.find('p-select[data-pc-section="root"], p-select.p-select').filter(':visible').first();
      if ($root.length) return cy.wrap($root).scrollIntoView().click();

      // last resort: force the trigger if PrimeNG gives it 0 height
      const $trigger = $wrap.find('.p-select-dropdown, [aria-label="dropdown trigger"]').first();
      if ($trigger.length) return cy.wrap($trigger).scrollIntoView().click({ force: true });

      throw new Error('Results-per-page select not found');
    });
  }

  static chooseResultsPerPage(n: number): Cypress.Chainable<JQuery<HTMLElement>> {
    this.openResultsPerPage();
    return cy
      .contains('[role="option"], .p-select-option', String(n))
      .should('be.visible')
      .click();
  }

  static chooseDefaultResultsPerPageOptions(): void {
    for (const size of this.RESULTS_PER_PAGE_SIZES) {
      this.chooseResultsPerPage(size);
    }
  }
}
