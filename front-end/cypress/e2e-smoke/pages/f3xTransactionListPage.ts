export class TransactionListPage {
  private static assertCellText(expectedValue: string | RegExp) {
    return (text: string) => {
      if (expectedValue instanceof RegExp) {
        expect(text).to.match(expectedValue);
        return;
      }

      expect(text).to.contain(expectedValue);
    };
  }

  static clickAddNewTransactionButton(menuItem: string) {
    cy.contains('button', 'Add new transaction').click();
    cy.contains('button', menuItem).click();
  }

  static assertVisible() {
    cy.contains('Transactions in this report').should('exist');
  }

  static openTransaction(rowIndex: number) {
    TransactionListPage.assertVisible();
    cy.get('.p-datatable-tbody > tr:visible')
      .eq(rowIndex)
      .find('td')
      .eq(TransactionTableColumns.transaction_type)
      .find('a')
      .first()
      .click();
  }

  static assertColumnValues(column: TransactionTableColumns, expectedValues: Array<string | RegExp>) {
    TransactionListPage.assertVisible();
    cy.get('.p-datatable-tbody > tr:visible').should('have.length.at.least', expectedValues.length);

    expectedValues.forEach((expectedValue, index) => {
      cy.get('.p-datatable-tbody > tr:visible')
        .eq(index)
        .find('td')
        .eq(column)
        .invoke('text')
        .then(TransactionListPage.assertCellText(expectedValue));
    });
  }

  static assertRowColumnValue(identifier: string | RegExp, column: TransactionTableColumns, expectedValue: string | RegExp) {
    TransactionListPage.assertVisible();
    cy.contains('.p-datatable-tbody > tr:visible', identifier)
      .find('td')
      .eq(column)
      .invoke('text')
      .then(TransactionListPage.assertCellText(expectedValue));
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
  actions = 7,
}
