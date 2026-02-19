import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';
import { ApiUtils } from '../utils/api';
import { Intercepts } from '../utils/intercepts';
import { SmokeAliases } from '../utils/aliases';

const REPORT_LIST_ALIAS_SOURCE = 'reportListPage';

type GoToReportListOptions = {
  waitForLists?: boolean;
  registerListIntercepts?: boolean;
  page?: string | number;
  pageSize?: string | number;
  ordering?: string;
  aliasScope?: string;
};

export class ReportListPage {
  static goToPage() {
    const reportsAlias = SmokeAliases.reportList.reports(`${REPORT_LIST_ALIAS_SOURCE}_goToPage`);
    Intercepts.reportList(reportsAlias, undefined, 1);
    cy.visit('/reports');
    cy.wait(`@${reportsAlias}`);
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.get('[data-cy="create-report"]').click({ force });
    cy.get('#typeDropdown').click();
    if (formType === 'F24') {
      cy.get(`[data-cy="${formType}"]`).should('contain', ' 24/48 Hour Report of Independent Expenditure');
    }
    cy.get(`[data-cy="${formType}"]`).click();
    if (submit) {
      cy.contains('Start building report').click();
    }
  }

  static deleteAllReports() {
    return cy.apiRequestWithCookies({
      method: 'POST',
      url: ApiUtils.apiPath('/reports/e2e-delete-all-reports/'),
    });
  }

  static createF3X(fd = defaultReportFormData) {
    ReportListPage.goToPage();
    F3xCreateReportPage.coverageCall();
    ReportListPage.clickCreateAndSelectForm('F3X');
    F3xCreateReportPage.waitForCoverage();
    F3xCreateReportPage.enterFormData(fd);
    PageUtils.clickButton('Save and continue');
  }

  static createF1M() {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F1M', true);
    cy.get('[data-cy="form-1m-component"]').should('exist');
  }

  static createF24(report = defaultForm24Data) {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F24', true, false);
    cy.get('p-togglebutton').contains(`${report.report_type_24_48} Hour`).should('exist').click();
    cy.get('[data-cy="start-report"]').click();
  }

  static editReport(reportName: string, fieldName = 'Edit') {
    ReportListPage.goToPage();
    PageUtils.clickKababItem(reportName, fieldName);
  }

  static submitReport(reportName: string) {
    ReportListPage.editReport(reportName);
    PageUtils.clickSidebarItem('SUBMIT YOUR REPORT');
    PageUtils.clickSidebarItem('Submit report');
    const alias = PageUtils.getAlias('');
    cy.get(alias).find('#filingPassword').type(''); // Insert password from env variable
    cy.get(alias).find('.p-checkbox').click();
    PageUtils.clickButton('Submit');
    PageUtils.clickButton('Yes');
    ReportListPage.goToPage();
  }

  static goToReportList(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
    options: GoToReportListOptions = {},
  ) {
    const {
      waitForLists = true,
      registerListIntercepts = true,
      page = '1',
      pageSize = '5',
      ordering = 'line_label,created',
      aliasScope = 'goToReportList',
    } = options;
    const aliasSource = `${REPORT_LIST_ALIAS_SOURCE}_${aliasScope}`;
    const receiptsAlias = SmokeAliases.reportList.receipts(aliasSource);
    const loansAlias = SmokeAliases.reportList.loans(aliasSource);
    const disbursementsAlias = SmokeAliases.reportList.disbursements(aliasSource);

    if (registerListIntercepts && includeReceipts) {
      Intercepts.transactionsList({
        alias: receiptsAlias,
        reportId,
        schedules: 'A',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
        times: 1,
      });
    }

    if (registerListIntercepts && includeLoans) {
      Intercepts.transactionsList({
        alias: loansAlias,
        reportId,
        schedules: 'C,D',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
        times: 1,
      });
    }

    if (registerListIntercepts && includeDisbursements) {
      Intercepts.transactionsList({
        alias: disbursementsAlias,
        reportId,
        schedules: 'B,E,F',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
        times: 1,
      });
    }

    const visit = cy.visit(`/reports/transactions/report/${reportId}/list`).then(() => {
      cy.contains('Transactions in this report').should('exist');
    });
    if (waitForLists && registerListIntercepts && includeLoans) {
      cy.wait(`@${loansAlias}`);
    }
    if (waitForLists && registerListIntercepts && includeDisbursements) {
      cy.wait(`@${disbursementsAlias}`);
    }
    if (waitForLists && registerListIntercepts && includeReceipts) {
      cy.wait(`@${receiptsAlias}`);
    }
    return visit;
  }
}
