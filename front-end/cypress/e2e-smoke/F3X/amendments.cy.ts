import { PageUtils } from '../pages/pageUtils';
import { ReportTransactionListPage } from '../pages/ReportTransactionListPage';
import { Initialize } from '../pages/loginPage';
import { DataSetup } from './setup';

describe('Amendments', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should test Create an amendment', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportTransactionListPage.goToReportTransactionListPage(result.report);
      PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
      PageUtils.clickLink('Submit report');
      PageUtils.submitReportForm();
      ReportTransactionListPage.goToPage();

      PageUtils.clickKababItem('Q2', 'Amend');

      PageUtils.containedOnPage('Amendment 1');
    });
  });
});
