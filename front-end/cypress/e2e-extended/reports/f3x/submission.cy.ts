import { DataSetup } from '../../../e2e-smoke/F3X/setup';
import { Initialize } from '../../../e2e-smoke/pages/loginPage';
import { currentYear, PageUtils } from '../../../e2e-smoke/pages/pageUtils';
import { ReportListPage } from '../../../e2e-smoke/pages/reportListPage';
import { TransactionListPage } from '../../../e2e-smoke/pages/f3xTransactionListPage';
import { buildScheduleA } from '../../../e2e-smoke/requests/library/transactions';
import { makeTransaction } from '../../../e2e-smoke/requests/methods';

const F3X_IDENTIFIER = 'Q2';

const dateReceived = `${currentYear}-04-12`;

function submitReport(report: string, sidebarSection: string, reject = false) {
  ReportListPage.gotToReportTransactionListPage(report);
  PageUtils.clickSidebarSection(sidebarSection);
  PageUtils.clickSidebarItem('Submit report');
  PageUtils.submitReportForm(reject);
}

describe('Report submissin (/reports)', () => {
  beforeEach(() => {
    Initialize();
  });

  it('should be editable if it is not submitted', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      const receipt = buildScheduleA('INDIVIDUAL_RECEIPT', 100.55, dateReceived, result.individual, result.report);
      makeTransaction(receipt, () => {
        ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsBeforeSubmit');
        ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Edit');
        ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Delete');
        
        ReportListPage.gotToReportTransactionListPage(result.report);
        TransactionListPage.assertAddTransactionButtonExists();
        TransactionListPage.assertTransactionActionExists('Individual Receipt', 'Edit');
        TransactionListPage.assertTransactionActionExists('Individual Receipt', 'Delete');
      });
    });
  });

  it('should be editable if report submission failed', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      const receipt = buildScheduleA('INDIVIDUAL_RECEIPT', 100.55, dateReceived, result.individual, result.report);
      makeTransaction(receipt, () => {
        submitReport(result.report,'SUBMIT YOUR REPORT', true);
        ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsAfterSubmitFailure');
        ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Edit');
        // Delete condition will fail until we update can_delete logic to allow deletion of reports with failed submissions
        // ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Delete')

        ReportListPage.gotToReportTransactionListPage(result.report);
        TransactionListPage.assertAddTransactionButtonExists();
        TransactionListPage.assertTransactionActionExists('Individual Receipt', 'Edit');
        // Delete condition will fail until we update can_delete logic to allow deletion of reports with failed submissions
        // TransactionListPage.assertTransactionActionExists('Individual Receipt', 'Delete');
      });
    });
  });

  it('should be uneditable if report is successfully submitted', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      const receipt = buildScheduleA('INDIVIDUAL_RECEIPT', 100.55, dateReceived, result.individual, result.report);
      makeTransaction(receipt, () => {
        submitReport(result.report, 'SUBMIT YOUR REPORT');
        ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsAfterSubmitSuccess');
        ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Edit');
        ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Delete');

        ReportListPage.gotToReportTransactionListPage(result.report);
        TransactionListPage.assertAddTransactionButtonDoesNotExist();
        TransactionListPage.assertTransactionActionDoesNotExist('Individual Receipt', 'Edit');
        TransactionListPage.assertTransactionActionDoesNotExist('Individual Receipt', 'Delete');  
      });
      
    });
  });
});
