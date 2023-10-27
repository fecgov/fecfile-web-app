import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, e2eReportStrings } from './models/ReportFormModel';

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

describe('Loans', () => {
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
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink(e2eReportStrings.loanByCommittee);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.urlCheck(e2eReportStrings.loanByCommitteeUrl);
    PageUtils.searchBoxInput(committeeFormData.committee_id);

    formData.date_received = undefined;

    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(e2eReportStrings.saveBoth);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanByCommittee).should('exist');
    cy.contains(e2eReportStrings.loanMade).should('exist'); 
  });

  it('should test: Loan By Committee - Receive loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink(e2eReportStrings.loanByCommittee);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.urlCheck(e2eReportStrings.loanByCommitteeUrl);
    PageUtils.searchBoxInput(committeeFormData.committee_id);

    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(e2eReportStrings.saveBoth);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanByCommittee).should('exist');
    cy.contains(e2eReportStrings.loanMade).should('exist');
    PageUtils.clickElement(e2eReportStrings.buttonLoansAndDebts);
    cy.contains(e2eReportStrings.recieveLoanPayment).click();

    PageUtils.urlCheck(e2eReportStrings.loanPaymentRecievedUrl);
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton(e2eReportStrings.save);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanPaymentRecieved).should('exist');
  });

  it('should test: Loan By Committee - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(committeeFormData);
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
    PageUtils.clickLink(e2eReportStrings.loanByCommittee);

    PageUtils.urlCheck(e2eReportStrings.loanByCommitteeUrl);
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(e2eReportStrings.saveAndAddGaurantor);

    PageUtils.urlCheck(e2eReportStrings.addGuarantorUrl);
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    PageUtils.clickButton(e2eReportStrings.saveAndAddGaurantor);
    PageUtils.urlCheck(e2eReportStrings.createSubTransaction + e2eReportStrings.addGuarantorUrl);
    PageUtils.clickButton(e2eReportStrings.cancel, '', true);
    PageUtils.urlCheck(e2eReportStrings.createSubTransaction + e2eReportStrings.addGuarantorUrl);
    PageUtils.clickButton(e2eReportStrings.cancel, '', true);

    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanByCommittee).click();
    PageUtils.urlCheck('/list/');
    cy.contains(individualContactFormData.last_name).should('exist');
  });
});
