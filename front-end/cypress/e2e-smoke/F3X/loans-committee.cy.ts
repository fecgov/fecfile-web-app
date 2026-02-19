import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
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

function setupLoanByCommittee() {
  return DataSetup({ individual: true, committee: true }).then((result: any) => {
    ReportListPage.goToReportList(result.report);
    StartTransaction.Loans().ByCommittee();
    // Search for created committee and enter load data, then add load guarantor
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    ContactLookup.getCommittee(result.committee);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    return cy.wrap(result, { log: false });
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
      
      cy.intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/transactions/'),
        query: { schedules: 'C2', parent: /.+/ },
      }).as('GuarantorList');
      cy.intercept({
        method: 'DELETE',
        pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
      }).as('DeleteGuarantor');
      cy.contains('Loan By Committee').click();
      cy.contains('Guarantors').should('exist');
      cy.wait('@GuarantorList');
      PageUtils.clickKababItem(result.individual.last_name, 'Delete');
      PageUtils.clickButton('Confirm');
      cy.wait('@DeleteGuarantor');
      cy.contains(result.individual.last_name).should('not.exist');
    });
  });
});
