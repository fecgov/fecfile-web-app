import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, loanEnums } from './models/ReportFormModel';

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

  xit('should test: Loan By Committee', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.loans);
    PageUtils.clickLink(loanEnums.loanByCommittee);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(committeeFormData.committee_id);

    formData.date_received = undefined;

    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(loanEnums.saveBoth);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanByCommittee).should('exist');
    cy.contains(loanEnums.loanMade).should('exist');
  });

  xit('should test: Loan By Committee - Receive loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.loans);
    PageUtils.clickLink(loanEnums.loanByCommittee);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(loanEnums.saveBoth);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanByCommittee).should('exist');
    cy.contains(loanEnums.loanMade).should('exist');
    PageUtils.clickElement(loanEnums.buttonLoansAndDebts);
    cy.contains(loanEnums.recieveLoanPayment).click();

    PageUtils.urlCheck(loanEnums.loanPaymentRecievedUrl);
    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton(loanEnums.save);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanPaymentRecieved).should('exist');
  });

  xit('should test: Loan By Committee - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(committeeFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create individual
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(individualContactFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.loans);
    PageUtils.clickLink(loanEnums.loanByCommittee);

    PageUtils.searchBoxInput(committeeFormData.committee_id);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickButton(loanEnums.saveAndAddGuarantor);

    PageUtils.urlCheck(loanEnums.addGuarantorUrl);
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    PageUtils.clickButton(loanEnums.saveAndAddGuarantor);
    PageUtils.urlCheck(loanEnums.createSubTransaction + loanEnums.addGuarantorUrl);
    PageUtils.clickButton(loanEnums.cancel, '', true);
    PageUtils.urlCheck(loanEnums.createSubTransaction + loanEnums.addGuarantorUrl);
    PageUtils.clickButton(loanEnums.cancel, '', true);

    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanByCommittee).click();
    PageUtils.urlCheck('/list/');
    cy.contains(individualContactFormData.last_name).should('exist');
  });
});
