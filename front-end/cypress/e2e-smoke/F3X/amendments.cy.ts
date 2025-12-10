import { PageUtils } from '../pages/pageUtils';
import { ReportListPage } from '../pages/reportListPage';
import { Initialize } from '../pages/loginPage';
import { DataSetup } from './setup';

describe('Amendments', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Create an amendment', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.goToReportList(result.report);
      PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
      PageUtils.clickLink('Submit report');
      PageUtils.submitReportForm();
      ReportListPage.goToPage();

      PageUtils.clickKababItem('Q2', 'Amend');

      PageUtils.containedOnPage('Amendment 1');
    });
  });
});
