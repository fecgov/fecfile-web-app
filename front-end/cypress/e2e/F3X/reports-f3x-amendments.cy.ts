import { defaultFormData as contactFormData } from '../models/ContactFormModel';
import { defaultForm3XData as reportFormData } from '../models/ReportFormModel';
import { ContactListPage } from '../pages/contactListPage';
import { F3xCreateReportPage } from '../pages/f3xCreateReportPage';
import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { Initialize } from '../pages/loginPage';

describe('Amendments', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Create an amendment', () => {
    ContactListPage.goToPage();
    PageUtils.clickButton('Add contact');
    const formData = {
      ...contactFormData,
      ...{
        contact_type: 'Organization',
      },
    };
    ContactListPage.enterFormData(formData);
    PageUtils.clickButton('Save');

    // Create report to add loan too
    ReportListPage.goToPage();
    F3xCreateReportPage.coverageCall();
    ReportListPage.clickCreateAndSelectForm('F3X');
    F3xCreateReportPage.waitForCoverage();
    F3xCreateReportPage.enterFormData(reportFormData);
    PageUtils.clickButton('Save and continue');

    const alias = PageUtils.getAlias('');
    PageUtils.urlCheck('/list');
    PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
    PageUtils.clickLink('Submit report');
    PageUtils.urlCheck('/submit/step2');
    PageUtils.enterValue('#treasurer_last_name', 'TEST');
    PageUtils.enterValue('#treasurer_first_name', 'TEST');
    PageUtils.enterValue('#filingPassword', Cypress.env('FILING_PASSWORD')); // Insert password from env variable
    cy.get(alias).find('.p-checkbox-box').first().click();
    PageUtils.clickButton('Submit');
    PageUtils.findOnPage('div', 'Are you sure?');

    PageUtils.clickButton('Yes');
    ReportListPage.goToPage();

    cy.get(alias).find('app-table-actions-button').click();
    cy.get(alias).contains('Amend').click();

    PageUtils.containedOnPage('Amendment 1');
  });
});
