import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { defaultFormData as individualContactFormData, committeeFormData } from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanReceivedFromIndividual() {
  F3XSetup({ individual: true, committee: true });
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

  xit('should test: Loan Received From Individual', () => {
    setupLoanReceivedFromIndividual();
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

  it('should test: Loan Guarantors', () => {
    setupLoanReceivedFromIndividual();
    PageUtils.clickButton('Save & add loan guarantor');
    cy.contains('Guarantors to loan source').should('exist');
    PageUtils.dropdownSetValue('#entity_type_dropdown', committeeFormData.contact_type, '');
    cy.get('#contact_1_lookup').find('#searchBox').safeType(committeeFormData.name);
    cy.contains(committeeFormData.name).should('exist');
    cy.contains(committeeFormData.name).click({ force: true });
    cy.get('#organization_name').should('exist').should('have.value', committeeFormData.name);
    cy.get('#committee_fec_id').should('exist').should('have.value', committeeFormData.committee_id);
    cy.get('#amount').safeType('2000');
    cy.get('h1').click();
    PageUtils.clickButton('Save');
    cy.contains('Transactions in this report').should('exist');
  });
});
