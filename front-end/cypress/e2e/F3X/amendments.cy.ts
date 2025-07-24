import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { Initialize } from '../pages/loginPage';
import { F3XSetup } from './f3x-setup';

describe('Amendments', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Create an amendment', () => {
    const alias = PageUtils.getAlias('');
    cy.wrap(F3XSetup({ individual: true })).then((result: any) => {
      cy.visit(`/reports/transactions/report/${result.report}/list`);
      PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
      PageUtils.clickLink('Submit report');
      PageUtils.urlCheck('/submit/step2');
      PageUtils.enterValue('#treasurer_last_name', 'TEST');
      PageUtils.enterValue('#treasurer_first_name', 'TEST');
      PageUtils.enterValue('#filingPassword', Cypress.env('FILING_PASSWORD')); // Insert password from env variable
      cy.get(alias).find('[data-cy="userCertified"]').first().click();
      PageUtils.clickButton('Submit');
      PageUtils.findOnPage('div', 'Are you sure?');

      PageUtils.clickButton('Yes');
      cy.wait(250);
      ReportListPage.goToPage();

      PageUtils.clickKababItem('Q2', 'Amend');

      PageUtils.containedOnPage('Amendment 1');
    });
  });
});
