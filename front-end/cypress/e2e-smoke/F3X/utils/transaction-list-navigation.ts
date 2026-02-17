import { PageUtils } from '../../pages/pageUtils';

function transactionsListPath(reportId: string): string {
  return `/reports/transactions/report/${reportId}/list`;
}

export function saveAndWaitForTransactionsList(reportId: string) {
  const listPath = transactionsListPath(reportId);

  PageUtils.clickButton('Save');
  cy.location('pathname', { timeout: 7500 }).should((pathname) => {
    expect(pathname).to.be.oneOf([listPath, `${listPath}/`]);
  });
  cy.contains('Transactions in this report', { timeout: 7500 }).should('exist');
}

export function saveAndReopenCurrentTransaction(reportId: string, readySelector = '#amount') {
  return cy.location('pathname').then((pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const transactionId = pathSegments.at(-1);
    const secondToLastSegment = pathSegments.at(-2);

    if (!transactionId || secondToLastSegment !== 'list') {
      throw new Error(`Expected transaction detail path ending with /list/<id>, got: ${pathname}`);
    }

    const detailPath = `${transactionsListPath(reportId)}/${transactionId}`;

    saveAndWaitForTransactionsList(reportId);
    cy.get('.p-datatable-tbody', { timeout: 7500 })
      .find(`a[href$="/${transactionId}"], a[href$="/${transactionId}/"]`)
      .first()
      .click({ force: true });
    cy.location('pathname', { timeout: 7500 }).should((currentPath) => {
      expect(currentPath).to.be.oneOf([detailPath, `${detailPath}/`]);
    });
    cy.get(readySelector).should('exist');
  });
}
