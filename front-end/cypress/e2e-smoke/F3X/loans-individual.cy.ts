import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { F3XAggregationHelpers } from '../../e2e-extended/reports/f3x/f3x-aggregation.helpers';

const formData = {
  ...defaultLoanFormData,
  purpose_description: undefined,
};

function setupLoanReceivedFromIndividual() {
  return cy
    .wrap(DataSetup({ individual: true, individual2: true, committee: true }))
    .then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Loans().Individual();
      PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
      ContactLookup.getContact(result.individual.last_name);
      formData.date_received = undefined;
      TransactionDetailPage.enterLoanFormData(formData);
      cy.wrap(result);
    });
}


function verifyLoanReceivedFromIndividualNoDeleteButton() {
  PageUtils.clickButton('Save both transactions');
  PageUtils.urlCheck('/list');
  cy.contains('Loan Received from Individual').should('exist');

  cy.get('app-transaction-receipts').within(() => {
    cy.contains('Loan Received from Individual')
      .closest('tr')
      .find('button')
      .each(($button) => {
        const innerHTML = $button.html();
        if (innerHTML.includes('Delete')) {
          throw new Error('A button contains "Delete", test failed.');
        }
      });
  });
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan Received From Individual', () => {
    setupLoanReceivedFromIndividual().then(verifyLoanReceivedFromIndividualNoDeleteButton);
  });

  it('should test: Loan Guarantors', () => {
    setupLoanReceivedFromIndividual().then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual2.last_name, formData['amount'], result.report);
      cy.contains('Transactions in this report').should('exist');
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    setupLoanReceivedFromIndividual().then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual2.last_name, formData['amount'], result.report);
      const receipts = PageUtils.getAlias('app-transaction-receipts');
      const guarantorDisplayName = [result.individual2.last_name, result.individual2.first_name]
        .filter(Boolean)
        .join(', ');

      cy.get(receipts)
        .contains('Loan Received from Individual')
        .should('be.visible')
        .click();

      cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**/').as('getTransaction');
      cy.wait('@getTransaction').its('response.statusCode').should('be.equal', 200);
      cy.contains('Guarantors').should('be.visible');

      cy.get('app-transaction-guarantors p-table')
        .contains('td', guarantorDisplayName)
        .should('be.visible');

      cy.intercept('DELETE', '**/api/v1/transactions/**').as('deleteGuarantor');
      cy.intercept(
        'GET',
        /\/api\/v1\/transactions\/\?page=1&ordering=name&page_size=5&parent=.*&schedules=C2/,
      ).as('guarantorsReload');

      F3XAggregationHelpers.clickRowActionByCellText(
        'app-transaction-guarantors p-table',
        guarantorDisplayName,
        'Delete',
      );
      PageUtils.clickButton('Confirm');

      cy.wait('@deleteGuarantor')
        .its('response.statusCode')
        .should('be.equal', 204);

      cy.wait('@guarantorsReload')
        .its('response.statusCode')
        .should('be.equal', 200);

      cy.get('app-transaction-guarantors p-table')
        .contains(guarantorDisplayName)
        .should('not.exist');
    });
  });
});
