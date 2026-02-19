import { defaultLoanFormData } from '../models/TransactionFormModel';
import { Initialize } from '../pages/loginPage';
import { currentYear, PageUtils } from '../pages/pageUtils';
import { TransactionDetailPage } from '../pages/transactionDetailPage';
import { StartTransaction } from './utils/start-transaction/start-transaction';
import { DataSetup } from './setup';
import { makeF3x } from '../requests/methods';
import { F3X_Q3 } from '../requests/library/reports';
import { ContactLookup } from '../pages/contactLookup';
import { ReportListPage } from '../pages/reportListPage';
import {
  assertNoDeleteButtonInTransactionRow,
  setupLoanFromBank,
} from './utils/loan-test-helpers';
import { SmokeAliases } from '../utils/aliases';

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
const LOANS_BANK_ALIAS_SOURCE = 'loansBankSpec';

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

// Helper to handle result of setupLoanFromBank for the first test
function handleLoanAgreementSetup(q3: string) {
  return (result: any) => {
    ReportListPage.goToReportList(q3);
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

    cy.intercept({
      method: 'Post',
    }).as(SmokeAliases.network.named('saveNewAgreement', LOANS_BANK_ALIAS_SOURCE));

    PageUtils.clickButton('Save', '', true);
    cy.wait(`@${SmokeAliases.network.named('saveNewAgreement', LOANS_BANK_ALIAS_SOURCE)}`);
    cy.contains('Loan Received from Bank').should('exist');
    PageUtils.urlCheck('/list');
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
    DataSetup({ individual: true, organization: true }).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      StartTransaction.Loans().FromBank();

      ContactLookup.getContact(result.organization.name);
      formData.date_received = undefined;
      TransactionDetailPage.enterLoanFormData(formData);

      PageUtils.clickAccordion('STEP TWO');
      TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
      PageUtils.clickButton('Save transactions');
      PageUtils.urlCheck('/list');
      cy.contains('Loan Received from Bank').should('exist');

      assertNoDeleteButtonInTransactionRow('Loan Received from Bank');
    });
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      clickLoan('Make loan repayment', 'LOAN_REPAYMENT_MADE');

      PageUtils.calendarSetValue('[data-cy="expenditure_date"]', new Date(currentYear, 4 - 1, 27));
      PageUtils.enterValue('#amount', formData.amount);
      TransactionDetailPage.clickSave(result.report);
      PageUtils.urlCheck('/list');
      cy.contains('Loan Repayment Made').should('exist');
    });
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    setupLoanFromBank({ organization: true }).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      clickLoan('Review loan agreement');
      cy.intercept('PUT', '**/api/v1/transactions/**').as(
        SmokeAliases.network.named('SaveTransactions', LOANS_BANK_ALIAS_SOURCE),
      );
      const reportId = result.report;

      const txList = (s: string) =>
        new RegExp(String.raw`/api/v1/transactions/\?(?=.*report_id=${reportId})${s}.*`);

      cy.intercept('GET', txList('(?=.*schedules=A)')).as(
        SmokeAliases.network.named('GetReceiptsAfterSave', LOANS_BANK_ALIAS_SOURCE),
      );
      cy.intercept('GET', txList('(?=.*schedules=.*C)(?=.*schedules=.*D)')).as(
        SmokeAliases.network.named('GetLoansAfterSave', LOANS_BANK_ALIAS_SOURCE),
      );
      cy.intercept('GET', txList('(?=.*schedules=.*B)(?=.*schedules=.*E)(?=.*schedules=.*F)'))
        .as(SmokeAliases.network.named('GetDisbursementsAfterSave', LOANS_BANK_ALIAS_SOURCE));

      PageUtils.clickButton('Save transactions');
      cy.wait([
        `@${SmokeAliases.network.named('SaveTransactions', LOANS_BANK_ALIAS_SOURCE)}`,
        `@${SmokeAliases.network.named('GetLoansAfterSave', LOANS_BANK_ALIAS_SOURCE)}`,
        `@${SmokeAliases.network.named('GetDisbursementsAfterSave', LOANS_BANK_ALIAS_SOURCE)}`,
        `@${SmokeAliases.network.named('GetReceiptsAfterSave', LOANS_BANK_ALIAS_SOURCE)}`,
      ]);
      PageUtils.locationCheck('/list');
      cy.contains('Loan Received from Bank').should('exist');
    });
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    setupLoanFromBank({ individual: true, organization: true }).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      cy.intercept(
        'GET',
        /\/api\/v1\/transactions\/\?(?=.*parent=)(?=.*schedules=C2).*/
      ).as(SmokeAliases.network.named('GetC2List', LOANS_BANK_ALIAS_SOURCE));
      clickLoan('Edit');

      // wait for form to be done (load c2 table)
      cy.wait(`@${SmokeAliases.network.named('GetC2List', LOANS_BANK_ALIAS_SOURCE)}`);
      cy.get('.p-datatable-mask').should('not.exist');

      // go to create guarantor
      cy.intercept('PUT', '**/api/v1/transactions/**').as(
        SmokeAliases.network.named('saveAddGuarantor', LOANS_BANK_ALIAS_SOURCE),
      )
      cy.contains('button', 'Save & add loan guarantor').should('be.enabled').click();
      cy.wait(`@${SmokeAliases.network.named('saveAddGuarantor', LOANS_BANK_ALIAS_SOURCE)}`);
      cy.contains('h1', 'Guarantors to loan source').should('be.visible');
      ContactLookup.getContact(result.individual.last_name);
      cy.get('#amount').safeType(formData['amount']);
      TransactionDetailPage.clickSave(result.report);
      clickLoan('Edit');
      cy.contains('ORGANIZATION NAME').should('exist');
      cy.get('#organization_name').should('have.value', result.organization.name);
    });
  });
});
