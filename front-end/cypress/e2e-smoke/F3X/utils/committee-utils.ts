import { ApiUtils } from '../../utils/api';
import type { RouteMatcher } from 'cypress/types/net-stubbing';

export class CommitteeUtils {
  static interceptMembers(alias = 'GetCommitteeMembers', query: Record<string, string | RegExp> = {}) {
    const matcher: RouteMatcher = {
      method: 'GET',
      pathname: ApiUtils.apiRoutePathname('/committee-members/'),
    };

    if (Object.keys(query).length > 0) matcher.query = query;

    return cy.intercept(matcher).as(alias);
  }
}
