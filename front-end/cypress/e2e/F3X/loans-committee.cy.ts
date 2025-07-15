import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { ContactFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanByCommittee() {
  return cy.wrap(F3XSetup({ individual: true, committee: true })).then((result: any) => {
    cy.visit(`/reports/transactions/report/${result.report}/list`);
    StartTransaction.Loans().ByCommittee();
    // Search for created committee and enter load data, then add load guarantor
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    PageUtils.searchBoxInput(result.committee.committee_id);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    return cy.wrap(result);
  });
}

function addGuarantor(individual: ContactFormData) {
  PageUtils.clickButton('Save & add loan guarantor');
  PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
  PageUtils.searchBoxInput(individual.last_name);
  cy.get('#amount').safeType(formData['amount']);
  cy.intercept({
    method: 'Post',
  }).as('saveGuarantor');
  PageUtils.clickButton('Save & add loan guarantor');
  cy.wait('@saveGuarantor');
  PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
  PageUtils.clickButton('Cancel');

  PageUtils.urlCheck('/list');
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan By Committee', () => {
    setupLoanByCommittee().then((result: any) => {
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
  });

  it('should test: Loan By Committee - Receive loan repayment', () => {
    // Search for created committee and enter load data, then add load guarantor
    setupLoanByCommittee().then((result: any) => {
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
  });

  it('should test: Loan By Committee - add Guarantor', () => {
    setupLoanByCommittee().then((result: any) => {
      addGuarantor(result.individual);
      cy.contains('Loan By Committee').click();
      PageUtils.urlCheck('/list/');
      cy.contains(result.individual.last_name).should('exist');
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    setupLoanByCommittee().then((result: any) => {
      addGuarantor(result.individual);
      PageUtils.clickKababItem('Loan By Committee', 'Edit');
      PageUtils.clickKababItem(result.individual.last_name, 'Delete');
      const alias = PageUtils.getAlias('');
      cy.get(alias).find('.p-confirmdialog-accept-button').click();

      cy.contains(result.individual.last_name).should('not.exist');
    });
  });
});
