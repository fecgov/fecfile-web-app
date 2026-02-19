import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { ApiUtils } from '../utils/api';
import {
  assertNoDeleteButtonInTransactionRow,
  setupLoanReceivedFromIndividual,
} from './utils/loan-test-helpers';
import { SmokeAliases } from '../utils/aliases';

const formData = {
  ...defaultLoanFormData,
  purpose_description: undefined,
};
const LOANS_INDIVIDUAL_ALIAS_SOURCE = 'loansIndividualSpec';

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test: Loan Received From Individual', () => {
    setupLoanReceivedFromIndividual(formData).then(() => {
      PageUtils.clickButton('Save both transactions');
      PageUtils.urlCheck('/list');
      cy.contains('Loan Received from Individual').should('exist');
      assertNoDeleteButtonInTransactionRow('Loan Received from Individual');
    });
  });

  it('should test: Loan Guarantors', () => {
    setupLoanReceivedFromIndividual(formData).then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual2.last_name, formData['amount'], result.report);
      cy.contains('Transactions in this report').should('exist');
    });
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    setupLoanReceivedFromIndividual(formData).then((result: any) => {
      TransactionDetailPage.addGuarantor(result.individual2.last_name, formData['amount'], result.report);
      const receipts = PageUtils.getAlias('app-transaction-receipts');

      cy.get(receipts)
        .contains('Loan Received from Individual')
        .should('be.visible')
        .click();

      cy.contains('tbody tr', result.individual2.last_name)
          .should('be.visible');

      cy.intercept({
        method: 'DELETE',
        pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
      }).as(SmokeAliases.network.named('DeleteGuarantor', LOANS_INDIVIDUAL_ALIAS_SOURCE));
      cy.intercept({
        method: 'GET',
        pathname: ApiUtils.apiRoutePathname('/transactions/'),
        query: { schedules: 'C2', parent: /.+/ },
      }).as(SmokeAliases.network.named('GuarantorsReload', LOANS_INDIVIDUAL_ALIAS_SOURCE));

      PageUtils.clickKababItem(result.individual2.last_name, 'Delete');
      PageUtils.clickButton('Confirm');

      cy.wait(`@${SmokeAliases.network.named('DeleteGuarantor', LOANS_INDIVIDUAL_ALIAS_SOURCE)}`)
        .its('response.statusCode')
        .should('be.equal', 204);

      cy.wait(`@${SmokeAliases.network.named('GuarantorsReload', LOANS_INDIVIDUAL_ALIAS_SOURCE)}`)
        .its('response.statusCode')
        .should('be.equal', 200);

      cy.contains('tbody tr', result.individual2.last_name)
          .should('not.exist');
    });
  });
});
