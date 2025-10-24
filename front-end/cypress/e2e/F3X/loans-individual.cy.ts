import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { DataSetup } from './setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanReceivedFromIndividual() {
  return cy.wrap(DataSetup({ individual: true, individual2: true, committee: true })).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().Individual();
    PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
    ContactLookup.getContact(result.individual.last_name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    cy.wrap(result);
  });
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan Received From Individual', () => {
    setupLoanReceivedFromIndividual().then(() => {
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
    });
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

      cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**&schedules=C2').as('GuarantorList');
      let alias = PageUtils.getAlias('app-transaction-receipts');
      cy.get(alias).contains('Loan Received from Individual').click();
      cy.wait('@GuarantorList');
      PageUtils.clickKababItem(result.individual2.last_name, 'Delete');

      alias = PageUtils.getAlias('');
      cy.get(alias).find('.p-confirmdialog-accept-button').click();

      cy.contains(result.individual.last_name).should('not.exist');
    });
  });
});
