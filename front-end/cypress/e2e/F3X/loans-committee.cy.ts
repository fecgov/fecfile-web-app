import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { committeeFormData, defaultFormData as individualContactFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanByCommittee() {
  F3XSetup({ committee: true, individual: true });
  StartTransaction.Loans().ByCommittee();
  // Search for created committee and enter load data, then add load guarantor
  PageUtils.urlCheck('LOAN_BY_COMMITTEE');
  PageUtils.searchBoxInput(committeeFormData.committee_id);
  formData.date_received = undefined;
  TransactionDetailPage.enterLoanFormData(formData);
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan By Committee', () => {
    setupLoanByCommittee();
    PageUtils.clickButton('Save both transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').should('exist');
    cy.contains('Loan Made').should('exist');
    cy.contains('Loan Made')
      .closest('tr')
      .find('button')
      .each(($button) => {
        const innerHTML = $button.html();
        if (innerHTML.includes('Delete')) {
          throw new Error('A button contains "Delete", test failed.');
        }
      });
  });

  it('should test: Loan By Committee - Receive loan repayment', () => {
    // Search for created committee and enter load data, then add load guarantor
    setupLoanByCommittee();
    PageUtils.clickButton('Save both transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').should('exist');
    cy.contains('Loan Made').should('exist');
    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Receive loan repayment').click({ force: true });

    PageUtils.urlCheck('LOAN_REPAYMENT_RECEIVED');
    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('[data-cy="contribution_date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Repayment Received').should('exist');
  });

  it('should test: Loan By Committee - add Guarantor', () => {
    setupLoanByCommittee();
    PageUtils.clickButton('Save & add loan guarantor');
    PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    cy.intercept({
      method: 'Post',
    }).as('saveGuarantor');
    PageUtils.clickButton('Save & add loan guarantor');
    cy.wait('@saveGuarantor');
    PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
    PageUtils.clickButton('Cancel');

    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').click();
    PageUtils.urlCheck('/list/');
    cy.contains(individualContactFormData.last_name).should('exist');
  });
});
