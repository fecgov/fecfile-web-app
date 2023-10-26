import { LoginPage } from './pages/loginPage';
import { PageUtils, currentYear } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { TransactionDetailPage } from './pages/transactionDetailPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { defaultDebtFormData as debtFormData, defaultLoanFormData } from './models/TransactionFormModel';
import { ContactFormData, defaultFormData as contactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, e2eReportStrings, F3xCreateReportFormData } from './models/ReportFormModel';

const committeeFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Committee' },
};

const organizationFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Organization' 
       },
};

const reportFormDataApril: F3xCreateReportFormData = {
  ...reportFormData,
  ...{
    report_code: 'Q1',
    coverage_from_date: new Date(currentYear, 0, 1),
    coverage_through_date: new Date(currentYear, 3, 30),
    
  }
}

const formData = {
  ...defaultLoanFormData,
  ...{
    purpose_description: undefined,
    loan_restructured: "NO",
    line_of_credit: "NO",
    others_liable: "NO",
    collateral: "NO",
    future_income: "NO",
    date_incurred: new Date("04/27/2023")
  },
};

describe('Amendments', () => {
  beforeEach(() => {
    LoginPage.login();
    ReportListPage.deleteAllReports();
    ContactListPage.deleteAllContacts();
    ContactListPage.goToPage();
    ReportListPage.goToPage();
  });

  it('should test Create an amendment', () => {
    ContactListPage.goToPage();
    PageUtils.clickButton(e2eReportStrings.new);
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton(e2eReportStrings.save);

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton(e2eReportStrings.saveAndCont);

    
    // Cash on hand
    PageUtils.clickSidebarItem(e2eReportStrings.cashOnHandLink);
    let alias = PageUtils.getAlias('');
    PageUtils.enterValue("#L6a_cash_on_hand_jan_1_ytd", 60000);
    PageUtils.calendarSetValue('p-calendar', new Date("05/27/2023"), alias);
    PageUtils.clickButton(e2eReportStrings.saveAndCont2);

    PageUtils.urlCheck("/list");
    PageUtils.clickSidebarItem(e2eReportStrings.submitReportLink);
    PageUtils.clickLink(e2eReportStrings.submitReport);
    PageUtils.urlCheck("/submit/step2");
    PageUtils.enterValue("filing_password", "T3stUpl@ad");

    /*
    // Search for created committee and enter load data, then add load gaurantor
    PageUtils.searchBoxInput(organizationFormData.name);
    formData.date_received = undefined;
    TransactionDetailPage.enterLoanFormData(formData);
    PageUtils.clickLink("STEP TWO:");
    TransactionDetailPage.enterLoanFormDataStepTwo(defaultLoanFormData);
    PageUtils.clickButton(e2eReportStrings.saveMultiple);
    PageUtils.urlCheck('/list');
    cy.contains(e2eReportStrings.loanFromBank).should('exist'); */

    // filing password : T3stUpl@ad
  });
});
