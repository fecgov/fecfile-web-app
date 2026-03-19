import { faker } from '@faker-js/faker';
import { DataSetup } from '../../e2e-smoke/F3X/setup';
import { StartTransaction } from '../../e2e-smoke/F3X/utils/start-transaction/start-transaction';
import {
  defaultScheduleFormData,
  DisbursementFormData,
} from '../../e2e-smoke/models/TransactionFormModel';
import { Initialize } from '../../e2e-smoke/pages/loginPage';
import { ContactLookup } from '../../e2e-smoke/pages/contactLookup';
import { currentYear, PageUtils } from '../../e2e-smoke/pages/pageUtils';
import { ReportListPage } from '../../e2e-smoke/pages/reportListPage';
import { TransactionDetailPage } from '../../e2e-smoke/pages/transactionDetailPage';
import { F24_24 } from '../../e2e-smoke/requests/library/reports';

const F3X_IDENTIFIER = 'Q2';
const F24_IDENTIFIER = F24_24.name;

const f3xReceiptData = {
  ...defaultScheduleFormData,
  electionYear: undefined,
  electionType: undefined,
  date_received: new Date(currentYear, 4 - 1, 27),
};

const independentExpenditureData: DisbursementFormData = {
  ...defaultScheduleFormData,
  date2: new Date(currentYear, 4 - 1, 27),
  supportOpposeCode: 'SUPPORT',
  signatoryDateSigned: new Date(currentYear, 4 - 1, 27),
  signatoryFirstName: faker.person.firstName(),
  signatoryLastName: faker.person.lastName(),
};

function submitCurrentReport(sidebarSection: string) {
  PageUtils.clickSidebarSection(sidebarSection);
  PageUtils.clickSidebarItem('Submit report');
  PageUtils.submitReportForm();
}

function amendReportFromList(reportId: string, reportListType: 'form-3x' | 'form-24', identifier: string) {
  const actionAlias = `Amend${reportId}`;
  const refreshAlias = `RefreshAfterAmend${reportId}`;

  ReportListPage.interceptReportAction(reportListType, reportId, 'amend', actionAlias);
  ReportListPage.interceptReportList(refreshAlias, reportListType);
  ReportListPage.clickReportAction(identifier, 'Amend');
  cy.wait(`@${actionAlias}`);
  cy.wait(`@${refreshAlias}`);
}

function unamendReportFromList(reportId: string, reportListType: 'form-3x' | 'form-24', identifier: string) {
  const actionAlias = `Unamend${reportId}`;
  const refreshAlias = `RefreshAfterUnamend${reportId}`;

  ReportListPage.interceptReportAction(reportListType, reportId, 'unamend', actionAlias);
  ReportListPage.interceptReportList(refreshAlias, reportListType);
  ReportListPage.clickReportAction(identifier, 'Unamend');
  cy.wait(`@${actionAlias}`);
  cy.wait(`@${refreshAlias}`);
}

describe('Reports can_unamend (/reports)', () => {
  beforeEach(() => {
    Initialize();
  });

  it('shows Unamend only while an F3X amendment is eligible, then clears it after unamend and reload', () => {
    cy.wrap(DataSetup()).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      submitCurrentReport('SUBMIT YOUR REPORT');

      ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsAfterSubmit');
      ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Unamend');

      amendReportFromList(result.report, 'form-3x', F3X_IDENTIFIER);
      ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Unamend');

      unamendReportFromList(result.report, 'form-3x', F3X_IDENTIFIER);
      cy.contains('Report Unamended').should('be.visible');
      ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Unamend');

      ReportListPage.goToPageAndWaitForReportList('form-3x', 'ReloadF3XAfterUnamend');
      ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Unamend');
    });
  });

  it('hides Unamend for an amended F3X after a transaction change and after reload', () => {
    cy.wrap(DataSetup({ individual: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.report);
      submitCurrentReport('SUBMIT YOUR REPORT');

      ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsBeforeMutation');
      amendReportFromList(result.report, 'form-3x', F3X_IDENTIFIER);
      ReportListPage.assertReportActionExists(F3X_IDENTIFIER, 'Unamend');

      ReportListPage.gotToReportTransactionListPage(result.report);
      StartTransaction.Receipts().Individual().IndividualReceipt();
      ContactLookup.getContact(result.individual.last_name);
      TransactionDetailPage.enterScheduleFormData(f3xReceiptData, false, '', true, 'contribution_date');
      TransactionDetailPage.clickSave();
      cy.get('tr').should('contain', 'Individual Receipt');

      ReportListPage.goToPageAndWaitForReportList('form-3x', 'GetF3XReportsAfterMutation');
      ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Unamend');

      ReportListPage.goToPageAndWaitForReportList('form-3x', 'ReloadF3XAfterMutation');
      ReportListPage.assertReportActionDoesNotExist(F3X_IDENTIFIER, 'Unamend');
    });
  });

  it('shows Unamend only while an F24 amendment is eligible, then clears it after unamend and reload', () => {
    cy.wrap(DataSetup({ individual: true, candidate: true, f24: true })).then((result: any) => {
      ReportListPage.gotToReportTransactionListPage(result.f24, false, true, false);
      StartTransaction.IndependentExpenditures().IndependentExpenditure();
      ContactLookup.getContact(result.individual.last_name, '', 'Individual');
      TransactionDetailPage.enterSheduleFormDataForVoidExpenditure(
        independentExpenditureData,
        result.candidate,
        false,
        '',
        'date_signed',
      );
      PageUtils.blurActiveField();
      TransactionDetailPage.clickSave();
      cy.location('pathname').should('include', `/reports/transactions/report/${result.f24}/list`);
      cy.get('tr').should('contain', 'Independent Expenditure');
      submitCurrentReport('SIGN & SUBMIT');

      ReportListPage.goToPageAndWaitForReportList('form-24', 'GetF24ReportsAfterSubmit');
      ReportListPage.assertReportActionDoesNotExist(F24_IDENTIFIER, 'Unamend');

      amendReportFromList(result.f24, 'form-24', F24_IDENTIFIER);
      ReportListPage.assertReportActionExists(F24_IDENTIFIER, 'Unamend');

      unamendReportFromList(result.f24, 'form-24', F24_IDENTIFIER);
      cy.contains('Report Unamended').should('be.visible');
      ReportListPage.assertReportActionDoesNotExist(F24_IDENTIFIER, 'Unamend');

      ReportListPage.goToPageAndWaitForReportList('form-24', 'ReloadF24AfterUnamend');
      ReportListPage.assertReportActionDoesNotExist(F24_IDENTIFIER, 'Unamend');
    });
  });
});
