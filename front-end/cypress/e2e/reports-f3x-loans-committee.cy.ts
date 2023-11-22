import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData } from './models/ReportFormModel';

const committeeFormData: ContactFormData = {
  ...individualContactFormData,
  ...{ contact_type: 'Committee' },
};

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
  },
};

xdescribe('Loans', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test: Loan By Committee', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink('Loan By Committee');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    PageUtils.searchBoxInput(committeeFormData.committee_id);

    formData.date_received = undefined;

    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton('Save both transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').should('exist');
    cy.contains('Loan Made').should('exist');
  });

  it('should test: Loan By Committee - Receive loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink('Loan By Committee');

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    PageUtils.searchBoxInput(committeeFormData.committee_id);

    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton('Save both transactions');
    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').should('exist');
    cy.contains('Loan Made').should('exist');
    PageUtils.clickElement('loans-and-debts-button');
    cy.contains('Receive loan repayment').click();

    PageUtils.urlCheck('LOAN_REPAYMENT_RECEIVED');
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton('Save');
    PageUtils.urlCheck('/list');
    cy.contains('Loan Repayment Received').should('exist');
  });

  it('should test: Loan By Committee - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink('Loan By Committee');

    PageUtils.urlCheck('LOAN_BY_COMMITTEE');
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton('Save & add loan guarantor');

    PageUtils.urlCheck('/C2_LOAN_GUARANTOR');
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    PageUtils.clickButton('Save & add loan guarantor');
    PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
    PageUtils.clickButton('Cancel', '', true);
    PageUtils.urlCheck('create-sub-transaction' + '/C2_LOAN_GUARANTOR');
    PageUtils.clickButton('Cancel', '', true);

    PageUtils.urlCheck('/list');
    cy.contains('Loan By Committee').click();
    PageUtils.urlCheck('/list/');
    cy.contains(individualContactFormData.last_name).should('exist');
  });
});
