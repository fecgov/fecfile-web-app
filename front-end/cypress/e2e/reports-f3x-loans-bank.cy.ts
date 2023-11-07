import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, e2eReportStrings, F3xCreateReportFormData } from './models/ReportFormModel';

const reportFormDataApril: F3xCreateReportFormData = {
  ...reportFormData,
  ...{
    report_code: 'Q1',
    coverage_from_date: new Date(currentYear, 0, 1),
    coverage_through_date: new Date(currentYear, 3, 30),
  },
};

const reportFormDataJuly: F3xCreateReportFormData = {
  ...reportFormData,
  ...{
    report_code: 'Q2',
    coverage_from_date: new Date(currentYear, 4, 1),
    coverage_through_date: new Date(currentYear, 7, 30),
  },
};

const organizationFormData: ContactFormData = {
  ...individualContactFormData,
  ...{ contact_type: 'Organization' },
};

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
    loan_restructured: 'NO',
    line_of_credit: 'NO',
    others_liable: 'NO',
    collateral: 'NO',
    future_income: 'NO',
    date_incurred: new Date('04/27/2023'),
  },
};

describe('Loans', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test new C1 - Loan Agreement for existing Schedule C Loan', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormDataApril);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.loans);
    PageUtils.clickLink(e2eReportStrings.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(e2eReportStrings.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).should('exist');

    // go back to reports, make new report

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton(true);
    F3xCreateReportPage.enterFormData(reportFormDataJuly);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Create report to add loan too
    ReportListPage.goToPage();
    const alias = PageUtils.getAlias('');
    cy.get(alias).contains('JULY 15').siblings().last().find('app-table-actions-button').children().last().click();

    cy.get(alias).contains(e2eReportStrings.editReport).first().click();
    PageUtils.urlCheck('cash-on-hand');
    PageUtils.enterValue('#L6a_cash_on_hand_jan_1_ytd', 60000);
    PageUtils.calendarSetValue('p-calendar', new Date('05/27/2023'), alias);
    PageUtils.clickButton(e2eReportStrings.saveAndCont2);
    cy.get(alias)
      .find("[datatest='" + e2eReportStrings.buttonLoansAndDebts + "']")
      .children()
      .last()
      .click();
    cy.get(alias).contains(e2eReportStrings.newLoanAgreement).click();

    PageUtils.urlCheck(e2eReportStrings.loanAgreementUrl);
    PageUtils.searchBoxInput(organizationFormData.name);
    const fd = {
      ...formData,
      ...{
        date_received: undefined,
        secured: undefined,
        memo_text: '',
        date_incurred: new Date('05/27/2023'),
        amount: 65000,
      },
    };
    TransactionDetailPage.enterNewLoanAgreementFormData(fd);
    PageUtils.clickButton(e2eReportStrings.save, '', true);
    cy.contains(e2eReportStrings.loanFromBank).should('exist');
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).last().should('exist');

    cy.get(alias)
      .find("[datatest='" + e2eReportStrings.buttonLoansAndDebts + "']")
      .children()
      .last()
      .click();
    cy.contains(e2eReportStrings.reviewLoan).click();
    PageUtils.urlCheck('/list/');
    PageUtils.valueCheck('#amount', '$65,000.00');
    PageUtils.valueCheck('#date_incurred', '05/27/2023');
  });

  it('should test: Loan Received from Bank', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.loans);
    PageUtils.clickLink(e2eReportStrings.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(e2eReportStrings.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).should('exist');
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.loans);
    PageUtils.clickLink(e2eReportStrings.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(e2eReportStrings.saveMultiple);

    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).last().should('exist');
    PageUtils.clickElement(e2eReportStrings.buttonLoansAndDebts);
    cy.contains(e2eReportStrings.makeLoanPayment).click();
    PageUtils.urlCheck(e2eReportStrings.makeLoanPaymentUrl);

    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton(e2eReportStrings.save);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.madeLoanPayment).should('exist');
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.loans);
    PageUtils.clickLink(e2eReportStrings.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(e2eReportStrings.saveMultiple);

    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).last().should('exist');
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find("[datatest='" + e2eReportStrings.buttonLoansAndDebts + "']")
      .children()
      .last()
      .click();
    cy.contains(e2eReportStrings.reviewLoan).click();
    PageUtils.urlCheck('/list/');
    PageUtils.clickButton(e2eReportStrings.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).should('exist');
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(e2eReportStrings.addLoansAndDebts);
    PageUtils.clickLink(e2eReportStrings.loans);
    PageUtils.clickLink(e2eReportStrings.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);

    PageUtils.clickButton('Save & add loan guarantor');

    PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    cy.contains(/^Save$/).click();
    cy.contains('Loan Received from Bank').click();
    PageUtils.urlCheck('/list/');
    cy.contains('ORGANIZATION NAME').should('exist');
    cy.get('#organization_name').should('have.value', individualContactFormData.name);
  });
});
