import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { makeContact } from '../requests/methods';
import { Individual_B_B } from '../requests/library/contacts';
import { ContactLookup } from '../pages/contactLookup';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanReceivedFromIndividual() {
  return cy.wrap(F3XSetup({ individual: true, committee: true })).then((result: any) => {
    cy.visit(`/reports/transactions/report/${result.report}/list`);
    StartTransaction.Loans().Individual();
    PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
    ContactLookup.getContact(result.individual.last_name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    cy.wrap(result);
  });
}

function addGuarantor(name: string, amount: number | string) {
  PageUtils.clickButton('Save & add loan guarantor');
  cy.contains('Guarantors to loan source').should('exist');
  PageUtils.searchBoxInput(name);
  cy.get('#amount').safeType(amount);
  cy.intercept({
    method: 'Post',
  }).as('saveGuarantor');
  PageUtils.clickButton('Save & add loan guarantor');
  cy.wait('@saveGuarantor');
  PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
  PageUtils.clickButton('Cancel');
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
    makeContact(Individual_B_B, (response) => {
      const individual2 = response.body;
      setupLoanReceivedFromIndividual().then((result) => {
        addGuarantor(individual2.last_name, formData['amount']);
        cy.contains('Transactions in this report').should('exist');
      });
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    makeContact(Individual_B_B, (response) => {
      const individual2 = response.body;
      setupLoanReceivedFromIndividual().then((result: any) => {
        addGuarantor(individual2.last_name, formData['amount']);

        PageUtils.clickKababItem('Loan Received from Individual', 'Edit');
        PageUtils.clickKababItem(individual2.last_name, 'Delete');
        const alias = PageUtils.getAlias('');
        cy.get(alias).find('.p-confirmdialog-accept-button').click();

        cy.contains(result.individual.last_name).should('not.exist');
      });
    });
  });
});
