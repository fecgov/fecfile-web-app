import { PageUtils } from '../../pages/pageUtils';

type TransactionMutationOptions = {
  transactionLabel: string;
  actionLabel: string;
  successLabel: string;
  oldReportLabel?: string;
  readySelector?: string;
};

export function runTransactionMutation(
  options: TransactionMutationOptions,
  fillForm: () => void | Cypress.Chainable<unknown>,
) {
  const {
    transactionLabel,
    actionLabel,
    successLabel,
    oldReportLabel,
    readySelector = '#amount',
  } = options;

  PageUtils.clickKababItem(transactionLabel, actionLabel);

  if (oldReportLabel) {
    cy.get(PageUtils.getAlias('')).find('#report-selector').select(oldReportLabel);
    PageUtils.clickButton('Continue');
  }

  if (readySelector) {
    cy.get(readySelector).should('be.visible');
  }

  return cy
    .then(() => fillForm())
    .then(() => {
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains(successLabel).should('exist');
    });
}

