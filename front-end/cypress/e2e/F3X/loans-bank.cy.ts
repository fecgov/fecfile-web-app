import { defaultLoanFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { F3XSetup, Setup } from './f3x-setup';
import { makeRequestToAPI, makeTransaction } from '../requests/methods';
import { F3X_Q3 } from '../requests/library/reports';
import {
  Authorizor,
  buildLoanAgreement,
  buildLoanFromBank,
  buildLoanReceipt,
  LoanInfo,
} from '../requests/library/transactions';

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
    loan_restructured: 'YES',
    line_of_credit: 'NO',
    others_liable: 'NO',
    collateral: 'NO',
    future_income: 'NO',
    date_incurred: new Date(currentYear, 3, 27),
  },
};

function clickLoan(button: string, urlCheck = '/list') {
  cy.contains('Loan Received from Bank').last().should('exist');
  const alias = PageUtils.getAlias('');
  cy.get(alias)
    .find("[datatest='" + 'loans-and-debts-button' + "']")
    .children()
    .last()
    .click();
  cy.contains(button).click({ force: true });
  PageUtils.urlCheck(urlCheck);
}

function setupLoanFromBank(setup: Setup) {
  return cy.wrap(F3XSetup(setup)).then(async (result: any) => {
    const apiCalls = [];
    const organization = result.organization;
    const reportId = result.report;
    const loanInfo: LoanInfo = {
      loan_amount: 60000,
      loan_incurred_date: '2025-04-27',
      loan_due_date: '2025-04-27',
      loan_interest_rate: '2.3%',
      secured: false,
      loan_restructured: false,
    };
    const authorizors: [Authorizor, Authorizor] = [
      {
        last_name: 'LastSenger',
        first_name: 'FirstSavannah',
        middle_name: null,
        prefix: null,
        suffix: null,
        date_signed: '2025-04-27',
      },
      {
        last_name: 'Leannon',
        first_name: 'Gina',
        middle_name: null,
        prefix: null,
        suffix: null,
        date_signed: '2024-04-27',
        title: 'Legacy',
      },
    ];

    const loanAgreement = buildLoanAgreement(loanInfo, organization, authorizors, reportId);

    const loanReceipt = buildLoanReceipt(loanInfo.loan_amount, loanInfo.loan_incurred_date, organization, reportId);
    const loanFromBank = buildLoanFromBank(loanInfo, organization, reportId, [loanAgreement, loanReceipt]);

    apiCalls.push(
      new Cypress.Promise((resolve) => {
        makeTransaction(loanFromBank);
        resolve();
      }),
    );
    await Cypress.Promise.all(apiCalls);
    cy.wrap(result);
  });
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test new C1 - Loan Agreement for existing Schedule C Loan', () => {
    makeRequestToAPI(
      'POST',
      'http://localhost:8080/api/v1/reports/form-3x/?fields_to_validate=filing_frequency',
      F3X_Q3,
      (response) => {
        const q3 = response.body.id;
        setupLoanFromBank({ individual: true, organization: true }).then((result: any) => {
          cy.visit(`/reports/transactions/report/${q3}/list`);
          clickLoan('New loan agreement');

          PageUtils.urlCheck('/C1_LOAN_AGREEMENT');
          TransactionDetailPage.getContact(result.organization);
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
          clickLoan('Review loan agreement');
          PageUtils.valueCheck('#amount', '$65,000.00');
          PageUtils.valueCheck('#loan_incurred_date', `05/27/${currentYear}`);
        });
      },
    );
  });

  it('should test: Loan Received from Bank', () => {
    cy.wrap(F3XSetup({ individual: true, organization: true })).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      StartTransaction.Loans().FromBank();

      TransactionDetailPage.getContact(result.organization);
      formData.date_received = undefined;
      TransactionDetailPage.enterLoanFormData(formData);

      PageUtils.clickAccordion('STEP TWO:');
      TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
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
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      clickLoan('Make loan repayment', 'LOAN_REPAYMENT_MADE');

      PageUtils.calendarSetValue('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 27));
      PageUtils.enterValue('#amount', formData.amount);
      PageUtils.clickButton('Save');
      PageUtils.urlCheck('/list');
      cy.contains('Loan Repayment Made').should('exist');
    });
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      clickLoan('Review loan agreement');
      PageUtils.clickButton('Save transactions');
      PageUtils.urlCheck('/list');
      cy.contains('Loan Received from Bank').should('exist');
    });
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    setupLoanFromBank({ individual: true, organization: true }).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      clickLoan('Edit');

      PageUtils.clickButton('Save & add loan guarantor');
      PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
      PageUtils.searchBoxInput(result.individual.last_name);
      cy.get('#amount').safeType(formData['amount']);
      cy.contains(/^Save$/).click();
      clickLoan('Edit');
      cy.contains('ORGANIZATION NAME').should('exist');
      cy.get('#organization_name').should('have.value', result.organization.name);
    });
  });
});
