import { PageUtils } from '../../pages/pageUtils';
import { ApiUtils } from '../../utils/api';
import { SmokeAliases } from '../../utils/aliases';

function transactionsListPath(reportId: string): string {
  return `/reports/transactions/report/${reportId}/list`;
}

type TransactionsListOptions = {
  visit?: boolean;
};

const TRANSACTION_LIST_NAV_ALIAS_SOURCE = 'transactionListNavigation';
const TRANSACTIONS_API_PATH = ApiUtils.apiRoutePathname('/transactions/');

function listPathMatches(pathname: string, reportId: string): boolean {
  const listPath = transactionsListPath(reportId);
  return pathname === listPath || pathname === `${listPath}/`;
}

function detailPathMatches(pathname: string, reportId: string, transactionId: string): boolean {
  const detailPath = `${transactionsListPath(reportId)}/${transactionId}`;
  return pathname === detailPath || pathname === `${detailPath}/`;
}

function waitForSuccessfulResponse(alias: string): Cypress.Chainable<void> {
  return cy
    .wait(`@${alias}`)
    .its('response.statusCode')
    .should((statusCode) => {
      expect(statusCode).to.be.greaterThan(199);
      expect(statusCode).to.be.lessThan(300);
    })
    .then(() => undefined);
}

function interceptTransactionsListRefresh(reportId: string): string {
  const alias = SmokeAliases.transactionListNavigation.listRefresh(TRANSACTION_LIST_NAV_ALIAS_SOURCE);

  cy.intercept({
    method: 'GET',
    pathname: TRANSACTIONS_API_PATH,
    query: { report_id: reportId },
    times: 1,
  }).as(alias);

  return alias;
}

function interceptTransactionSave(transactionId?: string): string {
  const alias = SmokeAliases.network.named('SaveTransaction', TRANSACTION_LIST_NAV_ALIAS_SOURCE);
  const escapedTransactionsPath = Cypress._.escapeRegExp(TRANSACTIONS_API_PATH);
  const putPathMatcher = transactionId
    ? new RegExp(`^${escapedTransactionsPath}${Cypress._.escapeRegExp(transactionId)}/?$`)
    : new RegExp(`^${escapedTransactionsPath}[^/]+/?$`);

  cy.intercept({
    method: 'POST',
    pathname: TRANSACTIONS_API_PATH,
    times: 1,
  }).as(alias);
  cy.intercept({
    method: 'PUT',
    pathname: putPathMatcher,
    times: 1,
  }).as(alias);

  return alias;
}

function waitForReadySelector(readySelector: string): Cypress.Chainable<void> {
  return cy
    .get(readySelector)
    .should('be.visible')
    .then(($element) => {
      if ($element.is('input, textarea, select, button')) {
        cy.wrap($element).should('not.be.disabled');
      }
    })
    .then(() => undefined);
}

function reopenTransactionFromList(
  reportId: string,
  transactionId: string,
  readySelector: string,
): Cypress.Chainable<void> {
  const listPath = transactionsListPath(reportId);
  const transactionLinkSelector = `a[href$="/${transactionId}"], a[href$="/${transactionId}/"]`;

  return cy
    .location('pathname')
    .then((currentPath) => {
      if (!listPathMatches(currentPath, reportId)) {
        cy.visit(listPath);
      }
    })
    .then(() => {
      cy.location('pathname').should((currentPath) => {
        expect(listPathMatches(currentPath, reportId)).to.equal(true);
      });
      cy.contains('Transactions in this report').should('exist');

      cy.get('.p-datatable-tbody')
        .find(transactionLinkSelector)
        .filter(':visible')
        .then(($links) => {
          if ($links.length < 1) {
            throw new Error(`Could not find visible transaction link for id ${transactionId} on list page`);
          }

          cy.wrap($links.eq(0)).click();
        });

      cy.location('pathname').should((nextPath) => {
        expect(detailPathMatches(nextPath, reportId, transactionId)).to.equal(true);
      });
      return waitForReadySelector(readySelector);
    });
}

export function saveAndWaitForTransactionsList(reportId: string) {
  const listPath = transactionsListPath(reportId);
  const saveAlias = interceptTransactionSave();
  const listRefreshAlias = interceptTransactionsListRefresh(reportId);

  PageUtils.clickButton('Save');
  waitForSuccessfulResponse(saveAlias);
  waitForSuccessfulResponse(listRefreshAlias);
  cy.location('pathname').should((pathname) => {
    expect(pathname).to.be.oneOf([listPath, `${listPath}/`]);
  });
  cy.contains('Transactions in this report').should('exist');
}

export function saveAndReopenCurrentTransaction(reportId: string, readySelector = '#amount') {
  return cy.location('pathname').then((pathname) => {
    const pathSegments = pathname.split('/').filter(Boolean);
    const transactionId = pathSegments.at(-1);
    const secondToLastSegment = pathSegments.at(-2);

    if (!transactionId || secondToLastSegment !== 'list') {
      throw new Error(`Expected transaction detail path ending with /list/<id>, got: ${pathname}`);
    }

    const saveAlias = interceptTransactionSave(transactionId);
    const listRefreshAlias = interceptTransactionsListRefresh(reportId);

    PageUtils.clickButton('Save');
    waitForSuccessfulResponse(saveAlias);
    waitForSuccessfulResponse(listRefreshAlias);
    return reopenTransactionFromList(reportId, transactionId, readySelector);
  });
}

export function withTransactionsList(
  reportId: string,
  action: () => void | Cypress.Chainable<unknown>,
  options: TransactionsListOptions = {},
) {
  const { visit = true } = options;

  if (visit) {
    cy.visit(transactionsListPath(reportId));
  }

  cy.contains('Transactions in this report').should('exist');
  return cy.then(() => action());
}

export function assertRunningTotals(
  reportId: string,
  expectedTotals: string[],
  options: TransactionsListOptions = {},
) {
  return withTransactionsList(
    reportId,
    () => {
      expectedTotals.forEach((expectedTotal, index) => {
        const row = index + 1;
        cy.get(`.p-datatable-tbody > :nth-child(${row}) > :nth-child(7)`).should(
          'contain',
          expectedTotal,
        );
      });
    },
    options,
  );
}

export function openTransactionFromListByRow(
  reportId: string,
  rowNumber: number,
  options: TransactionsListOptions = {},
) {
  return withTransactionsList(
    reportId,
    () => {
      cy.get(`.p-datatable-tbody > :nth-child(${rowNumber}) > :nth-child(2) > a`).click();
    },
    options,
  );
}

export function openTransactionFromListByAmount(
  reportId: string,
  amount: string,
  options: TransactionsListOptions = {},
) {
  return withTransactionsList(
    reportId,
    () => {
      cy.get('.p-datatable-tbody > tr')
        .contains('td', amount)
        .closest('tr')
        .find('td')
        .eq(1)
        .find('a')
        .first()
        .click();
    },
    options,
  );
}
