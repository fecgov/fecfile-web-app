import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { ContactFormData, defaultFormData as contactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData, e2eReportStrings } from './models/ReportFormModel';


const organizationFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Organization' 
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
    PageUtils.enterValue("#filing_password", "T3stUpl@ad");
    cy.get(alias).find('p-checkbox[inputid="truth_statement"]').click();
    PageUtils.clickButton(e2eReportStrings.submit);
    PageUtils.findOnPage("div", "Are you sure?")
    
    PageUtils.clickButton(e2eReportStrings.yes);
    ReportListPage.goToPage();

    cy.get(alias).find("app-table-actions-button").click();
    cy.get(alias).contains("Amend").click();

    PageUtils.containedOnPage("Amendment 1");
  });
});
