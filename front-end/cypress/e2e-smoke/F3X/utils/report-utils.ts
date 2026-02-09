import { ApiUtils } from '../../utils/api';
import { Intercepts } from '../../utils/intercepts';

export class ReportUtils {
  static interceptReportList(alias = 'GetReportList') {
    return Intercepts.reportList(alias);
  }

  static interceptReportById(reportId: string, alias = 'GetReport') {
    return cy.intercept({
      method: 'GET',
      pathname: ApiUtils.apiRoutePathname(`/reports/form-3x/${reportId}/`),
    }).as(alias);
  }

  static interceptSummaryCalc(alias = 'CalcSummary') {
    return Intercepts.summaryCalc(alias);
  }
}
