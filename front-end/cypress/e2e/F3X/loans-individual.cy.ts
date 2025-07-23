import { Initialize } from '../pages/loginPage';
import { PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import {
  defaultFormData as individualContactFormData,
  committeeFormData,
  createContact,
  ContactType,
} from '../models/ContactFormModel';
import { F3XSetup } from './f3x-setup';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { ContactListPage } from '../pages/contactListPage';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

function setupLoanReceivedFromIndividual() {
  F3XSetup({ individual: individualContactFormData, committee: committeeFormData });
  StartTransaction.Loans().Individual();
  PageUtils.urlCheck('LOAN_RECEIVED_FROM_INDIVIDUAL');
  PageUtils.searchBoxInput(individualContactFormData.last_name);
  formData.date_received = undefined;
  TransactionDetailPage.enterLoanFormData(formData);
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
    const secondIndividual = createContact(ContactType.INDIVIDUAL);
    ContactListPage.createIndividual(secondIndividual);
    setupLoanReceivedFromIndividual();
    addGuarantor(secondIndividual.last_name, formData['amount']);
    cy.contains('Transactions in this report').should('exist');
  });

  it('should test: Loan By Committee - delete Guarantor', () => {
    const secondIndividual = createContact(ContactType.INDIVIDUAL);
    ContactListPage.createIndividual(secondIndividual);
    setupLoanReceivedFromIndividual();
    addGuarantor(secondIndividual.last_name, formData['amount']);

    PageUtils.clickKababItem('Loan Received from Individual', 'Edit');
    PageUtils.clickKababItem(secondIndividual.last_name, 'Delete');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('.p-confirmdialog-accept-button').click();

    cy.contains(individualContactFormData.last_name).should('not.exist');
  });
});
