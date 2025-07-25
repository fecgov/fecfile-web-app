import { defaultFormData as individualContactFormData, organizationFormData } from '../models/ContactFormModel';
import { defaultLoanFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { F3XSetup, reportFormDataApril, reportFormDataJuly, Setup } from './f3x-setup';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
    loan_restructured: 'NO',
    line_of_credit: 'NO',
    others_liable: 'NO',
    collateral: 'NO',
    future_income: 'NO',
    date_incurred: new Date(currentYear, 3, 27),
  },
};

function setupLoanFromBank(setup: Setup) {
  F3XSetup(setup);
  StartTransaction.Loans().FromBank();

  PageUtils.searchBoxInput(organizationFormData.name);
  formData.date_received = undefined;
  TransactionDetailPage.enterLoanFormData(formData);

  PageUtils.clickAccordion('STEP TWO:');
  TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test new C1 - Loan Agreement for existing Schedule C Loan', () => {
    setupLoanFromBank({
      individual: individualContactFormData,
      organization: organizationFormData,
      report: reportFormDataApril,
    });

    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');

    // go back to reports, make new report
    // Create report
    cy.intercept({
      method: 'Post',
      url: 'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency,report_type_category,report_code,coverage_from_date,coverage_through_date,date_of_election,state_of_election,form_type',
    }).as('saveReport');
    ReportListPage.createF3X(reportFormDataJuly);

    cy.wait('@saveReport');

    // Create report to add loan too
    ReportListPage.editReport('JULY 15');
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.get(alias).contains('New loan agreement').click({ force: true });

    PageUtils.urlCheck('/C1_LOAN_AGREEMENT');
    PageUtils.searchBoxInput(organizationFormData.name);
    const fd = {
      ...formData,
      ...{
        date_received: undefined,
        secured: undefined,
        memo_text: '',
        date_incurred: new Date(currentYear, 4, 27),
        amount: 65000,
      },
    };
    TransactionDetailPage.enterNewLoanAgreementFormData(fd);

    cy.intercept({
      method: 'Post',
    }).as('saveNewAgreement');
    PageUtils.clickButton('Save', '', true);
    cy.wait('@saveNewAgreement');
    cy.contains('Loan Received from Bank').should('exist');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');

    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.contains('Review loan agreement').click({ force: true });
    PageUtils.urlCheck('/list/');
    PageUtils.valueCheck('#amount', '$65,000.00');
    PageUtils.valueCheck('#loan_incurred_date', `05/27/${currentYear}`);
  });

  it('should test: Loan Received from Bank', () => {
    setupLoanFromBank({ individual: individualContactFormData, organization: organizationFormData });

    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');
    cy.get('app-transaction-receipts').within(() => {
      cy.contains('Loan Received from Bank')
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

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    setupLoanFromBank({ organization: organizationFormData });

    PageUtils.clickButton('Save transactions');

    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');
    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Make loan repayment').click({ force: true });
    PageUtils.urlCheck('LOAN_REPAYMENT_MADE');

    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('[data-cy="expenditure_date"]', new Date(formData.date_received));
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Repayment Made').should('exist');
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    setupLoanFromBank({ organization: organizationFormData });

    PageUtils.clickButton('Save transactions');

    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.contains('Review loan agreement').click({ force: true });
    PageUtils.urlCheck('/list/');
    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    setupLoanFromBank({ individual: individualContactFormData, organization: organizationFormData });

    PageUtils.clickButton('Save & add loan guarantor');

    PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    cy.contains(/^Save$/).click();
    cy.contains('Loan Received from Bank').click();
    PageUtils.urlCheck('/list/');
    cy.contains('ORGANIZATION NAME').should('exist');
    cy.get('#organization_name').should('have.value', organizationFormData.name);
  });
});
