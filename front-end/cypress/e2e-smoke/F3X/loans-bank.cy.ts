import { defaultLoanFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { DataSetup, Setup } from './setup';
import { makeF3x, makeTransaction } from '../requests/methods';
import { F3X_Q3 } from '../requests/library/reports';
import {
  Authorizor,
  buildLoanAgreement,
  buildLoanFromBank,
  buildLoanReceipt,
  LoanInfo,
} from '../requests/library/transactions';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';

const formData = {
  ...defaultLoanFormData,
  purpose_description: undefined,
  loan_restructured: 'YES',
  line_of_credit: 'NO',
  others_liable: 'NO',
  collateral: 'NO',
  future_income: 'NO',
  date_incurred: new Date(currentYear, 3, 27),
};

function clickLoan(button: string, urlCheck = '/list') {
  cy.get('app-transaction-loans-and-debts').contains('Loan Received from Bank').should('exist');
  PageUtils.clickKababItem('Loan Received from Bank', button, 'app-transaction-loans-and-debts');
  PageUtils.urlCheck(urlCheck);
}

function setupLoanFromBank(setup: Setup) {
  return cy.wrap(DataSetup(setup)).then((result: any) => {
    const organization = result.organization;
    const reportId = result.report;

    const loanInfo: LoanInfo = {
      loan_amount: 60000,
      loan_incurred_date: `${currentYear}-04-27`,
      loan_due_date: `${currentYear}-04-27`,
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
        date_signed: `${currentYear}-04-27`,
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
    const loanReceipt = buildLoanReceipt(
      loanInfo.loan_amount,
      loanInfo.loan_incurred_date,
      organization,
      reportId,
    );
    const loanFromBank = buildLoanFromBank(loanInfo, organization, reportId, [
      loanAgreement,
      loanReceipt,
    ]);

    return makeTransaction(loanFromBank).then(() => result);
  });
}

// Helper for the “no Delete button” assertion so it doesn’t deepen nesting in the test.
function assertNoDeleteButtonInLoanReceivedFromBankRow() {
  cy.get('app-transaction-loans-and-debts').within(() => {
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
}

// Helper to handle result of setupLoanFromBank for the first test
function handleLoanAgreementSetup(q3: string) {
  return (result: any) => {
    ReportListPage.gotToReportTransactionListPage(q3);
    clickLoan('New loan agreement');

    PageUtils.urlCheck('/C1_LOAN_AGREEMENT');
    ContactLookup.getContact(result.organization.name);

    const fd = {
      ...formData,
      date_received: undefined,
      secured: undefined,
      memo_text: '',
      date_incurred: new Date(currentYear, 4, 27),
      amount: 65000,
    };

    TransactionDetailPage.enterNewLoanAgreementFormData(fd);

    cy.intercept('POST', '**/api/v1/transactions/**').as('saveNewAgreement');

    TransactionDetailPage.clickSave();
    cy.wait('@saveNewAgreement').then((interception) => {
      expect(interception.response?.statusCode).to.equal(200);
    });
    PageUtils.locationCheck('/list');
    cy.contains('Loan Received from Bank').should('be.visible');
    clickLoan('Review loan agreement');
    PageUtils.valueCheck('input[id^="loan-agreement-amount-"]', '$65,000.00');
    PageUtils.valueCheck('#loan_incurred_date', `05/27/${currentYear}`);
  };
}

// Helper to handle the makeF3x callback so the `it` body stays shallow
function handleMakeF3xForLoanAgreement(response: any) {
  const q3 = response.body.id;
  setupLoanFromBank({ individual: true, organization: true }).then(handleLoanAgreementSetup(q3));
}

describe('Loans', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test new C1 - Loan Agreement for existing Schedule C Loan', () => {
    makeF3x(F3X_Q3, handleMakeF3xForLoanAgreement);
  });

  it('should test: Loan Received from Bank', () => {
    cy.wrap(DataSetup({ individual: true, organization: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Loans().FromBank();

      ContactLookup.getContact(result.organization.name);
      formData.date_received = undefined;
      TransactionDetailPage.enterLoanFormData(formData);

      PageUtils.clickAccordion('STEP TWO');
      TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
      PageUtils.clickFormActionButton('Save transactions', '[data-cy="navigation-control-button"]:visible');
      PageUtils.locationCheck('/list');
      cy.contains('Transactions in this report').should('be.visible');
      cy.contains('Loan Received from Bank').should('exist');

      assertNoDeleteButtonInLoanReceivedFromBankRow();
    });
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      clickLoan('Make loan repayment', 'LOAN_REPAYMENT_MADE');

      PageUtils.calendarSetValue('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 27));
      PageUtils.enterValue('#amount', formData.amount);
      TransactionDetailPage.clickSave();
      PageUtils.urlCheck('/list');
      cy.contains('Loan Repayment Made').should('be.visible');
    });
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      clickLoan('Review loan agreement');
      cy.get('input[id^="loan-agreement-amount-"]').should('exist');
      cy.get('#loan_incurred_date').should('exist');
    });
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    setupLoanFromBank({ individual: true, organization: true }).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      clickLoan('Edit');
      cy.contains('ORGANIZATION NAME').should('exist');
      cy.get('#organization_name').should('have.value', result.organization.name);
      TransactionDetailPage.addGuarantor(result.individual.last_name, formData.amount, result.report);
      clickLoan('Edit');
      cy.contains('ORGANIZATION NAME').should('exist');
      cy.get('#organization_name').should('have.value', result.organization.name);
    });
  });
});
