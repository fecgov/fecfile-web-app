import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { ApiUtils } from '../utils/api';
import {
  assertNoDeleteButtonInTransactionRow,
  setupLoanByCommittee,
} from './utils/loan-test-helpers';
import { SmokeAliases } from '../utils/aliases';

const formData = {
  ...defaultLoanFormData,
  purpose_description: undefined,
};
const LOANS_COMMITTEE_ALIAS_SOURCE = 'loansCommitteeSpec';

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan By Committee', () => {
    setupLoanByCommittee(formData).then((result: any) => {
      PageUtils.clickButton('Save both transactions');
      PageUtils.urlCheck('/list');
      cy.contains('Loan By Committee').should('exist');
      cy.contains('Loan Made').should('exist');
      assertNoDeleteButtonInTransactionRow('Loan Made');
    });
  });

  it('should test: Loan By Committee - Receive loan repayment', () => {
    // Search for created committee and enter load data, then add load guarantor
    setupLoanByCommittee(formData).then((result: any) => {
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
    setupLoanByCommittee(formData).then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual.last_name, formData['amount'], result.report);
      cy.contains('Loan By Committee').click();
      PageUtils.urlCheck('/list/');
      cy.contains(result.individual.last_name).should('exist');
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    setupLoanByCommittee(formData).then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual.last_name, formData['amount'], result.report);
      cy.intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/transactions/'),
        query: { schedules: 'C2', parent: /.+/ },
      }).as(SmokeAliases.network.named('GuarantorList', LOANS_COMMITTEE_ALIAS_SOURCE));
      cy.intercept({
        method: 'DELETE',
        pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
      }).as(SmokeAliases.network.named('DeleteGuarantor', LOANS_COMMITTEE_ALIAS_SOURCE));
      cy.contains('Loan By Committee').click();
      cy.wait(`@${SmokeAliases.network.named('GuarantorList', LOANS_COMMITTEE_ALIAS_SOURCE)}`);
      PageUtils.clickKababItem(result.individual.last_name, 'Delete');
      PageUtils.clickButton('Confirm');
      cy.wait(`@${SmokeAliases.network.named('DeleteGuarantor', LOANS_COMMITTEE_ALIAS_SOURCE)}`);
      cy.contains(result.individual.last_name).should('not.exist');
    });
  });
});
