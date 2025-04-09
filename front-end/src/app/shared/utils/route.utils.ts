import { ActivatedRouteSnapshot } from '@angular/router';

export type RouteData = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

/**
 * collectRouteData(router: Router)
 *
 * Traverses the route tree collecting data attributes from
 * each node and flattening them into one RouteData object
 *
 * This is an adaptation of an example function provided by
 * the Angular documtation (see: https://angular.io/api/router/ActivatedRouteSnapshot#properties)
 */
export function collectRouteData(snapshot: ActivatedRouteSnapshot): RouteData {
  let data = {} as RouteData;
  const stack: ActivatedRouteSnapshot[] = [snapshot.root];
  while (stack.length > 0) {
    const route = stack.pop()!;
    data = { ...data, ...route.data };
    stack.push(...route.children);
  }

  return data;
}
