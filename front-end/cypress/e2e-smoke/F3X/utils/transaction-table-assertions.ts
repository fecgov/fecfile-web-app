import { TransactionTableColumns } from '../../pages/f3xTransactionListPage';

export function assertTransactionTableRow(
  index: number,
  type: string,
  containMemo: boolean,
  aggregateValue: string,
) {
  cy.get('tbody tr').eq(index).as('row');

  // This validates table structure alongside data values.
  cy.get('@row').find('td').eq(TransactionTableColumns.line_number).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.date).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.amount).should('exist');
  cy.get('@row').find('td').eq(TransactionTableColumns.actions).should('exist');

  cy.get('@row').find('td').eq(TransactionTableColumns.transaction_type).should('contain', type);
  cy.get('@row')
    .find('td')
    .eq(TransactionTableColumns.memo_code)
    .should(containMemo ? 'contain' : 'not.contain', 'Y');
  cy.get('@row').find('td').eq(TransactionTableColumns.aggregate).should('contain', aggregateValue);
}

