import { LoginPage } from './pages/loginPage';
import { PageUtils } from './pages/pageUtils';
import { ReportListPage } from './pages/reportListPage';
import { ContactListPage } from './pages/contactListPage';
import { F3xCreateReportPage } from './pages/f3xCreateReportPage';
import { ContactFormData, defaultFormData as contactFormData } from './models/ContactFormModel';
import { defaultFormData as reportFormData } from './models/ReportFormModel';

const organizationFormData: ContactFormData = {
  ...contactFormData,
  ...{ contact_type: 'Organization' },
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
    PageUtils.clickButton('New');
    ContactListPage.enterFormData(organizationFormData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    ReportListPage.clickCreateButton();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    // Cash on hand
    PageUtils.clickSidebarItem('Cash on hand');
    const alias = PageUtils.getAlias('');
    PageUtils.enterValue('#L6a_cash_on_hand_jan_1_ytd', 60000);
    PageUtils.calendarSetValue('p-calendar', new Date('05/27/2023'), alias);
    PageUtils.clickButton('Save & continue');

    PageUtils.urlCheck('/list');
    PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
    PageUtils.clickLink('Submit report');
    PageUtils.urlCheck('/submit/step2');
    PageUtils.enterValue('#filing_password', 'T3stUpl@ad');
    cy.get(alias).find('p-checkbox[inputid="truth_statement"]').click();
    PageUtils.clickButton('Submit');
    PageUtils.findOnPage('div', 'Are you sure?');

    PageUtils.clickButton('Yes');
    ReportListPage.goToPage();

    cy.get(alias).find('app-table-actions-button').click();
    cy.get(alias).contains('Amend').click();

    PageUtils.containedOnPage('Amendment 1');
  });
});
