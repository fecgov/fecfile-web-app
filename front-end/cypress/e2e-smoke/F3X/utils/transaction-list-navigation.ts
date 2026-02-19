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

function interceptTransactionSave(): string {
  const alias = SmokeAliases.network.named('SaveTransaction', TRANSACTION_LIST_NAV_ALIAS_SOURCE);
  const escapedTransactionsPath = Cypress._.escapeRegExp(TRANSACTIONS_API_PATH);
  const putPathMatcher = new RegExp(`^${escapedTransactionsPath}[^/]+/?$`);

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

export function saveAndWaitForTransactionsList(reportId: string, eventLabel = 'Click Save') {
  const listPath = transactionsListPath(reportId);

  return cy.withAliasEvent(eventLabel, () => {
    const saveAlias = interceptTransactionSave();
    const listRefreshAlias = interceptTransactionsListRefresh(reportId);

    PageUtils.clickButton('Save');
    waitForSuccessfulResponse(saveAlias);
    waitForSuccessfulResponse(listRefreshAlias);
    cy.location('pathname').should((pathname) => {
      expect(pathname).to.be.oneOf([listPath, `${listPath}/`]);
    });
    cy.contains('Transactions in this report').should('exist');
  });
}

function withTransactionsList(
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
