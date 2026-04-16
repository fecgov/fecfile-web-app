import { F3xCreateReportPage } from './f3xCreateReportPage';
import { defaultForm24Data, defaultForm3XData as defaultReportFormData } from '../models/ReportFormModel';
import { Intercept, PageUtils } from './pageUtils';

type ReportListType = 'form-3x' | 'form-24';
type ReportAction = 'amend' | 'unamend';

export class ReportListPage {
  private static readonly reportActionsTriggerSelector = '[data-cy="report-actions-trigger"]';
  private static readonly reportActionsPopoverSelector = '[data-cy="table-actions-popover"]:visible';

  static goToPage() {
    ReportListPage.interceptReportList('GetReports');
    cy.visit('/reports');
    cy.wait('@GetReports');
  }

  static interceptReportList(alias = 'GetReports', reportListType?: ReportListType) {
    const pathname = reportListType ? `/api/v1/reports/${reportListType}/` : '/api/v1/reports/**';
    cy.intercept({ method: 'GET', pathname }).as(alias);
  }

  static goToPageAndWaitForReportList(reportListType: ReportListType, alias = 'GetReportList') {
    ReportListPage.interceptReportList(alias, reportListType);
    cy.visit('/reports');
    cy.wait(`@${alias}`);
    cy.contains('Manage reports').should('exist');
  }

  static interceptReportAction(
    reportListType: ReportListType,
    reportId: string,
    action: ReportAction,
    alias = `${action}Report`,
  ) {
    cy.intercept({
      method: 'POST',
      pathname: `/api/v1/reports/${reportListType}/${reportId}/${action}/`,
    }).as(alias);
  }

  static clickReportAction(identifier: string, action: string) {
    ReportListPage.openReportActions(identifier);
    cy.get(ReportListPage.reportActionsPopoverSelector)
      .find(`[data-cy="${ReportListPage.actionDataCy(action)}"]`)
      .should('be.visible')
      .click();
  }

  static assertReportActionExists(identifier: string, action: string) {
    ReportListPage.openReportActions(identifier);
    cy.get(ReportListPage.reportActionsPopoverSelector)
      .find(`[data-cy="${ReportListPage.actionDataCy(action)}"]`)
      .should('exist')
      .and('be.visible');
    ReportListPage.closeReportActions();
  }

  static assertReportActionDoesNotExist(identifier: string, action: string) {
    ReportListPage.openReportActions(identifier);
    cy.get(ReportListPage.reportActionsPopoverSelector)
      .find(`[data-cy="${ReportListPage.actionDataCy(action)}"]`)
      .should('not.exist');
    ReportListPage.closeReportActions();
  }

  static clickCreateAndSelectForm(formType: string, force = false, submit = true) {
    cy.get('[data-cy="create-report"]:visible').click({ force });
    cy.get('#typeDropdown:visible').click();
    if (formType === 'F24') {
      cy.get(`[data-cy="${formType}"]`).should('contain', ' 24/48 Hour Report of Independent Expenditure');
    }
    cy.get(`[data-cy="${formType}"]`).click();
    if (submit) {
      cy.contains('Start building report').click();
    }
  }

  static deleteAllReports() {
    cy.getCookie('csrftoken').then((cookie) => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:8080/api/v1/reports/e2e-delete-all-reports/',
        headers: {
          'x-csrftoken': cookie?.value,
        },
      });
    });
  }

  static createF3X(fd = defaultReportFormData) {
    ReportListPage.goToPage();
    F3xCreateReportPage.coverageCall();
    ReportListPage.clickCreateAndSelectForm('F3X');
    F3xCreateReportPage.waitForCoverage();
    F3xCreateReportPage.enterFormData(fd);
    PageUtils.clickFormActionButton('Save & continue', '[data-cy="save-cancel-actions"]:visible');
  }

  static createF1M() {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F1M', true);
    cy.get('[data-cy="form-1m-component"]').should('be.visible');
  }

  static createF24(report = defaultForm24Data) {
    ReportListPage.goToPage();
    ReportListPage.clickCreateAndSelectForm('F24', true, false);
    cy.get('p-togglebutton').contains(`${report.report_type_24_48} Hour`).should('be.visible').click();
    cy.get('[data-cy="start-report"]:visible').click();
  }

  static gotToReportTransactionListPage(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
  ) {
    return ReportListPage.checkReportTransactionListPageLoaded(
      reportId,
      includeReceipts,
      includeDisbursements,
      includeLoans,
    );
  }

  private static checkReportTransactionListPageLoaded(
    reportId: string,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
  ) {
    const fx = () => {
      cy.visit(`/reports/transactions/report/${reportId}/list`);
      cy.location('pathname').should('include', `/reports/transactions/report/${reportId}/list`);
      cy.contains('Transactions in this report').should('be.visible');
    };

    ReportListPage.interceptTransactions(reportId, fx, includeReceipts, includeDisbursements, includeLoans);
  }
  

  static interceptTransactions(
    reportId: string,
    fx: () => void,
    includeReceipts = true,
    includeDisbursements = true,
    includeLoans = true,
  ) {
    const intercepts: Intercept[] = [];
    [
      { enabled: includeReceipts, alias: 'GetReceipts', schedules: 'A' },
      { enabled: includeLoans, alias: 'GetLoans', schedules: 'C,D' },
      { enabled: includeDisbursements, alias: 'GetDisbursements', schedules: 'B,E,F' },
    ].forEach(({ enabled, alias, schedules }) => {
      if (!enabled) return;
      intercepts.push({
        method: 'GET',
        url: `http://localhost:8080/api/v1/transactions/**&report_id=${reportId}**&schedules=${schedules}**`,
        alias,
      });
    });
    PageUtils.interceptAndWait(intercepts, fx);
  }

  private static openReportActions(identifier: string) {
    cy.contains('tr[role="row"]', identifier)
      .scrollIntoView()
      .within(() => {
        cy.get(ReportListPage.reportActionsTriggerSelector).should('be.visible').click();
      });

    cy.get(ReportListPage.reportActionsPopoverSelector).should('be.visible');
  }

  private static closeReportActions() {
    cy.get('body').click(0, 0);
    cy.get(ReportListPage.reportActionsPopoverSelector).should('not.exist');
  }

  private static actionDataCy(action: string) {
    return `report-action-${action
      .trim()
      .toLowerCase()
      .replaceAll(/[^a-z0-9]+/g, '-')
      .replaceAll(/(^-|-$)/g, '')}`;
  }
}
