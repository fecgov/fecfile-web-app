import { ApiUtils } from '../../utils/api';
import { Intercepts } from '../../utils/intercepts';

type QueryValue = string | RegExp;
type QueryShape = Record<string, QueryValue>;

export class TransactionUtils {
  static interceptList(opts: {
    alias: string;
    reportId?: QueryValue;
    schedules?: QueryValue;
    parent?: QueryValue;
    contact?: QueryValue;
    includePaging?: boolean;
    extraQuery?: QueryShape;
  }) {
    return Intercepts.transactionsList(opts);
  }

  static interceptById(alias = 'GetTransaction') {
    return cy.intercept({
      method: 'GET',
      pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
    }).as(alias);
  }

  static interceptDelete(alias = 'DeleteTransaction') {
    return cy.intercept({
      method: 'DELETE',
      pathname: new RegExp(`^${ApiUtils.apiRoutePathname('/transactions/')}[^/]+/$`),
    }).as(alias);
  }
}
