import { ApiUtils } from './api';
import type { RouteMatcher } from 'cypress/types/net-stubbing';

type QueryValue = string | RegExp;
type QueryShape = Record<string, QueryValue>;

type TransactionsListInterceptOptions = {
  alias: string;
  reportId?: QueryValue;
  schedules?: QueryValue;
  parent?: QueryValue;
  contact?: QueryValue;
  page?: QueryValue;
  pageSize?: QueryValue;
  ordering?: QueryValue;
  includePaging?: boolean;
  extraQuery?: QueryShape;
  times?: number;
};

export class Intercepts {
  static reportList(alias = 'GetReportList', query?: QueryShape, times?: number) {
    const reportsPath = Cypress._.escapeRegExp(
      ApiUtils.apiRoutePathname('/reports').replace(/\/+$/, ''),
    );
    const matcher: RouteMatcher = {
      method: 'GET',
      pathname: new RegExp(`^${reportsPath}(?:/form-[^/]+)?/?$`),
    };

    if (query) matcher.query = query;
    if (times !== undefined) matcher.times = times;

    return cy.intercept(matcher).as(alias);
  }

  static transactionsList(opts: TransactionsListInterceptOptions) {
    const {
      alias,
      reportId,
      schedules,
      parent,
      contact,
      page = '1',
      pageSize = '5',
      ordering = 'line_label,created',
      includePaging = false,
      extraQuery = {},
      times,
    } = opts;

    const query: QueryShape = { ...extraQuery };
    if (reportId !== undefined) query['report_id'] = reportId;
    if (schedules !== undefined) query['schedules'] = schedules;
    if (parent !== undefined) query['parent'] = parent;
    if (contact !== undefined) query['contact'] = contact;

    // Keep potentially unstable table params opt-in.
    if (includePaging) {
      query['page'] = page;
      query['page_size'] = pageSize;
      query['ordering'] = ordering;
    }

    const matcher: RouteMatcher = {
      method: 'GET',
      pathname: ApiUtils.apiRoutePathname('/transactions/'),
    };

    if (Object.keys(query).length > 0) matcher.query = query;
    if (times !== undefined) matcher.times = times;

    return cy.intercept(matcher).as(alias);
  }

  static summaryCalc(alias = 'CalcSummary') {
    return cy
      .intercept('POST', ApiUtils.apiRoutePathname('/web-services/summary/calculate-summary/'))
      .as(alias);
  }
}
