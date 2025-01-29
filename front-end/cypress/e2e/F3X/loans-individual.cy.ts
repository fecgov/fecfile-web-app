import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './start-transaction/start-transaction';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanReceivedFromIndividual() {
  F3XSetup({ individual: true });
  StartTransaction.Loans().Individual();
  PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
  PageUtils.searchBoxInput(individualContactFormData.last_name);
  formData.date_received = undefined;
  TransactionDetailPage.enterLoanFormData(formData);
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan By Committee', () => {
    setupLoanReceivedFromIndividual();
    PageUtils.clickButton('Save both transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Individual').should('exist');
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
