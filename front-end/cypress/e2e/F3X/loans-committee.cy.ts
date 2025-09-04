import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { ContactFormData } from '../models/ContactFormModel';
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

function setupLoanByCommittee() {
  return cy.wrap(DataSetup({ individual: true, committee: true })).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().ByCommittee();
    // Search for created committee and enter load data, then add load guarantor
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    ContactLookup.getCommittee(result.committee);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    return cy.wrap(result);
  });
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
      TransactionDetailPage.addGuarantor(result.individual.last_name, formData['amount'], result.report);
      cy.contains('Loan By Committee').click();
      PageUtils.urlCheck('/list/');
      cy.contains(result.individual.last_name).should('exist');
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    setupLoanByCommittee().then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual.last_name, formData['amount'], result.report);
      cy.intercept('GET', 'http://localhost:8080/api/v1/transactions/**&schedules=C2').as('GuarantorList');
      cy.contains('Loan By Committee').click();
      cy.wait('@GuarantorList');
      cy.wait('@GuarantorList');
      PageUtils.clickKababItem(result.individual.last_name, 'Delete');
      const alias = PageUtils.getAlias('');
      cy.get(alias).find('.p-confirmdialog-accept-button').click();

      cy.contains(result.individual.last_name).should('not.exist');
    });
  });
});
