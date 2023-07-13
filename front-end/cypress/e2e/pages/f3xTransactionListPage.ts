export class TransactionListPage {
  static clickAddNewTransactionButton(menuItem: string) {
    cy.contains('button', 'Add new transaction').click();
    cy.contains('button', menuItem).click();
  }
}

export enum TransactionTableColumns {
  line_number = 0,
  transaction_type = 1,
  name = 2,
  date = 3,
  memo_code = 4,
  amount = 5,
  aggregate = 6,
  transaction_id = 7,
  parent_id = 8,
  actions = 9,
}
