import { ContactFormData, defaultFormData as individualContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, F3xCreateReportFormData } from './models/ReportFormModel';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';

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

let organizationFormData: ContactFormData;

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
    ReportListPage.goToPage();

    organizationFormData = {
      ...individualContactFormData,
      ...{ contact_type: 'Organization' },
    };
  });

  it('should test new C1 - Loan Agreement for existing Schedule C Loan', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormDataApril);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    PageUtils.clickLink('Loan Received from Bank');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');

    // go back to reports, make new report

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton(true);
    F3xCreateReportPage.enterFormData(reportFormDataJuly);
    PageUtils.clickButton('Save and continue');

    // Create report to add loan too
    ReportListPage.goToPage();
    const alias = PageUtils.getAlias('');
    cy.get(alias).contains('JULY 15').siblings().last().find('app-table-actions-button').children().last().click();

    cy.get(alias).contains('Edit report').first().click();
    cy.wait(500);
    cy.url().then((currentUrl) => {
      if (currentUrl.includes('cash-on-hand')) {
        PageUtils.urlCheck('cash-on-hand');
        PageUtils.enterValue('#L6a_cash_on_hand_jan_1_ytd', 60000);
        PageUtils.calendarSetValue('p-calendar', new Date('05/27/2023'), alias);
        PageUtils.clickButton('Save & continue');
      }
    });
    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.get(alias).contains('New loan agreement').click();

    PageUtils.urlCheck('/C1_LOAN_AGREEMENT');
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
    PageUtils.clickButton('Save', '', true);
    cy.contains('Loan Received from Bank').should('exist');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');

    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.contains('Review loan agreement').click();
    PageUtils.urlCheck('/list/');
    PageUtils.valueCheck('#amount', '$65,000.00');
    PageUtils.valueCheck('#date_incurred', '05/27/2023');
  });

  it('should test: Loan Received from Bank', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    PageUtils.clickLink('Loan Received from Bank');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    PageUtils.clickLink('Loan Received from Bank');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton('Save transactions');

    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');
    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Make loan repayment').click();
    PageUtils.urlCheck('LOAN_REPAYMENT_MADE');

    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Repayment Made').should('exist');
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    PageUtils.clickLink('Loan Received from Bank');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    PageUtils.clickLink('STEP TWO:');
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton('Save transactions');

    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').last().should('exist');
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find("[datatest='" + 'loans-and-debts-button' + "']")
      .children()
      .last()
      .click();
    cy.contains('Review loan agreement').click();
    PageUtils.urlCheck('/list/');
    PageUtils.clickButton('Save transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Received from Bank').should('exist');
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Navigate to loans
    PageUtils.clickSidebarItem('Add loans and debts');
    PageUtils.clickLink('LOANS');
    PageUtils.clickLink('Loan Received from Bank');

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
