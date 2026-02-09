import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { PageUtils } from './pageUtils';
import { ApiUtils } from '../utils/api';
import { Intercepts } from '../utils/intercepts';

type GoToReportListOptions = {
  waitForLists?: boolean;
  registerListIntercepts?: boolean;
  page?: string | number;
  pageSize?: string | number;
  ordering?: string;
};

export class ReportListPage {
  static goToPage() {
    Intercepts.reportList('GetReports');
    cy.visit('/reports');
    cy.wait('@GetReports', { timeout: 20000 });
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
    } = options;

    if (registerListIntercepts && includeReceipts) {
      Intercepts.transactionsList({
        alias: 'GetReceipts',
        reportId,
        schedules: 'A',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
      });
    }

    if (registerListIntercepts && includeLoans) {
      Intercepts.transactionsList({
        alias: 'GetLoans',
        reportId,
        schedules: 'C,D',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
      });
    }

    if (registerListIntercepts && includeDisbursements) {
      Intercepts.transactionsList({
        alias: 'GetDisbursements',
        reportId,
        schedules: 'B,E,F',
        includePaging: true,
        page: String(page),
        pageSize: String(pageSize),
        ordering,
      });
    }

    cy.visit(`/reports/transactions/report/${reportId}/list`);

    if (waitForLists && includeLoans) cy.wait('@GetLoans');
    if (waitForLists && includeDisbursements) cy.wait('@GetDisbursements');
    if (waitForLists && includeReceipts) cy.wait('@GetReceipts');
  }
}
