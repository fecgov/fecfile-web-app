import { ApiUtils } from './api';
import type { RouteMatcher } from 'cypress/types/net-stubbing';
import { SmokeAliases } from './aliases';

type QueryValue = string | RegExp;
type QueryShape = Record<string, QueryValue>;
type InterceptTimes = number | 'any';

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
  times?: InterceptTimes;
};

const INTERCEPTS_ALIAS_SOURCE = 'sharedIntercepts';

function stripTrailingSlashes(value: string): string {
  let normalized = value;
  while (normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}

export class Intercepts {
  static reportList(
    alias = SmokeAliases.reportList.reports(INTERCEPTS_ALIAS_SOURCE),
    query?: QueryShape,
    times?: InterceptTimes,
  ) {
    const reportsPath = Cypress._.escapeRegExp(
      stripTrailingSlashes(ApiUtils.apiRoutePathname('/reports')),
    );
    const matcher: RouteMatcher = {
      method: 'GET',
      pathname: new RegExp(`^${reportsPath}(?:/form-[^/]+)?/?$`),
    };

    if (query) matcher.query = query;
    if (times !== undefined) {
      if (times === 'any') {
        (matcher as RouteMatcher & { times?: InterceptTimes }).times = times;
      } else {
        matcher.times = times;
      }
    }

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
    if (times !== undefined) {
      if (times === 'any') {
        (matcher as RouteMatcher & { times?: InterceptTimes }).times = times;
      } else {
        matcher.times = times;
      }
    }

    return cy.intercept(matcher).as(alias);
  }

  static summaryCalc(alias = SmokeAliases.network.named('CalcSummary', INTERCEPTS_ALIAS_SOURCE)) {
    return cy
      .intercept('POST', ApiUtils.apiRoutePathname('/web-services/summary/calculate-summary/'))
      .as(alias);
  }
}
