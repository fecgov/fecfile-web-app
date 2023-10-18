import { LoginPage } from './pages/loginPage';
import { currentYear, PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultLoanFormData } from './models/TransactionFormModel';
import { defaultFormData as individualContactFormData, ContactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, loanEnums } from './models/ReportFormModel';

const organizationFormData: ContactFormData = {
  ...individualContactFormData,
  ...{ contact_type: 'Organization' },
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

  it('should test: Loan Received from Bank', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(organizationFormData);
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
    PageUtils.clickLink(loanEnums.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(loanEnums.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanFromBank).should('exist');
  });

  it('should test: Loan Received from Bank - Make loan repayment', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.loans);
    PageUtils.clickLink(loanEnums.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(loanEnums.saveMultiple);

    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanFromBank).last().should('exist');
    PageUtils.clickElement(loanEnums.buttonLoansAndDebts);
    cy.contains(loanEnums.makeLoanPayment).click();
    PageUtils.urlCheck(loanEnums.makeLoanPaymentUrl);

    formData.date_received = new Date(currentYear, 4 - 1, 27);
    PageUtils.calendarSetValue('p-calendar[inputid="date"]', formData.date_received);
    PageUtils.enterValue('#amount', formData.amount);
    PageUtils.clickButton(loanEnums.save);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.madeLoanPayment).should('exist');
  });

  it('should test: Loan Received from Bank - Review loan agreement', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(loanEnums.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(loanEnums.saveAndCont);

    // Navigate to loans
    PageUtils.clickSidebarItem(loanEnums.addLoansAndDebts);
    PageUtils.clickLink(loanEnums.loans);
    PageUtils.clickLink(loanEnums.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(loanEnums.saveMultiple);

    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanFromBank).last().should('exist');
    const alias = PageUtils.getAlias('');
    cy.get(alias)
      .find("[datatest='" + loanEnums.buttonLoansAndDebts + "']")
      .children()
      .last()
      .click();
    cy.contains(loanEnums.reviewLoan).click();
    PageUtils.urlCheck('/list/');
    PageUtils.clickButton(loanEnums.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanFromBank).should('exist');
  });

  it('should test: Loan Received from Bank - add Guarantor', () => {
    // Create a committee contact to be used with contact lookup
    ContactListPage.goToPage();
    PageUtils.clickButton(loanEnums.new);
    ContactListPage.enterFormData(organizationFormData);
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
    PageUtils.clickLink(loanEnums.loanFromBank);

    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);

    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(loanEnums.saveAndAddGaurantor);

    PageUtils.urlCheck(loanEnums.addGuarantorUrl);
    PageUtils.searchBoxInput(individualContactFormData.last_name);
    cy.get('#amount').safeType(formData['amount']);
    PageUtils.clickButton(loanEnums.saveAndAddGaurantor);

    PageUtils.clickButton(loanEnums.cancel);
    PageUtils.urlCheck('/list');
    cy.contains(loanEnums.loanFromBank).click();
    PageUtils.urlCheck('/list/');
    cy.contains(individualContactFormData.last_name).should('exist');
  });
});
