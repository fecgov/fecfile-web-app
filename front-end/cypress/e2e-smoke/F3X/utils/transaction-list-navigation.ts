import { PageUtils } from '../../pages/pageUtils';

function transactionsListPath(reportId: string): string {
  return `/reports/transactions/report/${reportId}/list`;
}

export function saveAndWaitForTransactionsList(reportId: string) {
  const listPath = transactionsListPath(reportId);

  PageUtils.clickButton('Save');
  cy.location('pathname', { timeout: 20000 }).should((pathname) => {
    expect(pathname).to.be.oneOf([listPath, `${listPath}/`]);
  });
  cy.contains('Transactions in this report', { timeout: 20000 }).should('exist');
}

export function saveAndReopenCurrentTransaction(reportId: string, readySelector = '#amount') {
  return cy.location('pathname').then((pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const lastSegment = pathSegments.at(-1);
    const secondToLastSegment = pathSegments.at(-2);

    if (!lastSegment || secondToLastSegment !== 'list') {
      throw new Error(`Expected transaction detail path ending with /list/<id>, got: ${pathname}`);
    }

    saveAndWaitForTransactionsList(reportId);
    cy.visit(`${transactionsListPath(reportId)}/${lastSegment}`);
    cy.get(readySelector).should('exist');
  });
}
