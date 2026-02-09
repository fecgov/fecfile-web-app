import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import { ApiUtils } from '../utils/api';

const formData = {
  ...defaultLoanFormData,
  purpose_description: undefined,
};

function setupLoanReceivedFromIndividual() {
  return DataSetup({ individual: true, individual2: true, committee: true }).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().Individual();
    PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
    ContactLookup.getContact(result.individual.last_name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    return cy.wrap(result, { log: false });
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

      cy.get(receipts)
        .contains('Loan Received from Individual')
        .should('be.visible')
        .click();

      cy.contains('tbody tr', result.individual2.last_name, { timeout: 15000 })
          .should('be.visible');

      cy.intercept({
        method: 'DELETE',
        pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
      }).as('DeleteGuarantor');
      cy.intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/transactions/'),
        query: { schedules: 'C2', parent: /.+/ },
      }).as('GuarantorsReload');

      PageUtils.clickKababItem(result.individual2.last_name, 'Delete');
      PageUtils.clickButton('Confirm');

      cy.wait('@DeleteGuarantor')
        .its('response.statusCode')
        .should('be.equal', 204);

      cy.wait('@GuarantorsReload')
        .its('response.statusCode')
        .should('be.equal', 200);

      cy.contains('tbody tr', result.individual2.last_name, { timeout: 15000 })
          .should('not.exist');
    });
  });
});
