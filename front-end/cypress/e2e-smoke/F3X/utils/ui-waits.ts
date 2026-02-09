export class UiWaits {
  static tableMaskGone(timeout = 20000) {
    cy.get('.p-datatable-mask', { timeout }).should('not.exist');
  }

  static toastGone(timeout = 10000) {
    cy.get('.p-toast-message', { timeout }).should('not.exist');
  }
}
