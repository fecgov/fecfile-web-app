export class TransactionListPage {
  static clickAddNewTransactionButton(menuItem: string) {
    cy.contains('button', 'Add new transaction').click();
    cy.contains('button', menuItem).click();
  }
}
