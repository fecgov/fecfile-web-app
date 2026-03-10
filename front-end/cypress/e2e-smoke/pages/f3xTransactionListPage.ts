import { buildDataCy } from '../../utils/dataCy';

class TransactionListPage {
  static clickAddNewTransactionButton(menuItem: string) {
    cy.getByDataCy('transactions-page-add-transaction-actions-button').click();
    cy.getByDataCy(buildDataCy('transactions-page-add-transaction', 'actions', menuItem, 'button')).click();
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
