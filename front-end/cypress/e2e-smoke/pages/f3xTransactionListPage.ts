export class TransactionListPage {
  private static readonly transactionActionsTriggerSelector = '[data-cy="transaction-actions-trigger"]';
  private static readonly transactionActionsPopoverSelector = '[data-cy="table-actions-popover"]:visible';

  static clickAddNewTransactionButton(menuItem: string) {
    cy.contains('button', 'Add new transaction').click();
    cy.contains('button', menuItem).click();
  }

  static assertAddTransactionButtonExists() {
    cy.get('[data-cy="add-transactions-actions-trigger"]').should('exist');
  }

  static assertAddTransactionButtonDoesNotExist() {
    cy.get('[data-cy="add-transactions-actions-trigger"]').should('not.exist');
  }

  static assertTransactionActionExists(identifier: string, action: string) {
    TransactionListPage.openTransactionActions(identifier);
    cy.get(TransactionListPage.transactionActionsPopoverSelector)
      .find(`[data-cy="${TransactionListPage.actionDataCy(action)}"]`)
      .should('exist')
      .and('be.visible');
    TransactionListPage.closeTransactionActions();
  }

  static assertTransactionActionDoesNotExist(identifier: string, action: string) {
    TransactionListPage.openTransactionActions(identifier);
    cy.get(TransactionListPage.transactionActionsPopoverSelector)
      .find(`[data-cy="${TransactionListPage.actionDataCy(action)}"]`)
      .should('not.exist');
    TransactionListPage.closeTransactionActions();
  }

  private static openTransactionActions(identifier: string) {
    cy.contains('tr[role="row"]', identifier)
      .scrollIntoView()
      .within(() => {
        cy.get(TransactionListPage.transactionActionsTriggerSelector).should('be.visible').click();
      });

    cy.get(TransactionListPage.transactionActionsPopoverSelector).should('be.visible');
  }

  private static closeTransactionActions() {
    cy.get('body').click(0, 0);
    cy.get(TransactionListPage.transactionActionsPopoverSelector).should('not.exist');
  }

  private static actionDataCy(action: string) {
    return `transaction-action-${action
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replaceAll(/(^-|-$)/g, '')}`;
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
