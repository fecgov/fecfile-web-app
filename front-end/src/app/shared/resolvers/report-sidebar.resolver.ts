import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportSidebarResolver implements Resolve<string | undefined> {
  urlMatch: RegExp[] = [
    /^\/reports\/f3x\/create\/cash-on-hand\/[\d:a-z-]+/, // Enter a transaction group
    /^\/transactions\/report\/[\d:a-z-]+/, // Enter a transaction group
    /^\/reports\/f3x\/summary\/[\d:a-z-]+/, // Review a report group
    /^\/reports\/f3x\/detailed-summary\/[\d:a-z]+/, // Review a report group
    /^\/reports\/f3x\/web-print\/[\d:a-z-]+/, // Review a report group
    /^\/reports\/f3x\/memo\/[\d:a-z-]+/, // Review a report group
    /^\/reports\/f3x\/submit\/step1\/[\d:a-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/step2\/[\d:a-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/status\/[\d:a-z-]+/, // Submit your report group
  ];

  constructor(private store: Store, private reportService: ReportService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<string | undefined> {
    const url = route.pathFromRoot
      .filter((value) => value.routeConfig)
      .map((value) => value.routeConfig!.path)
      .join('/');
    //.map((value) => value.url.map((segment) => segment.toString()).join('/'));
    console.log('URL:', url);

    if (this.isActive(this.urlMatch.slice(0, 2), url)) {
      console.log('Transactions found!');
      return of('Transactions');
    } else if (this.isActive(this.urlMatch.slice(2, 6), url)) {
      console.log('Review found!');
      return of('Review');
    } else if (this.isActive(this.urlMatch.slice(6, 9), url)) {
      console.log('Submission found!');
      return of('Submission');
    }

    console.log('Returning undefined');
    return of(undefined);
  }

  /**
   * Determine if the given url matches one of the regular expressions that define which
   * group of menu items is selected.
   *
   * @param urlMatch {RegExp{}} - List of url regular expressions to compare to current router url
   * @param url {string} - Current url in browser address bar
   * @returns {boolean} - True is url matches one of the matchUrl regular expressions
   */
  isActive(urlMatch: RegExp[], url: string): boolean {
    return urlMatch.reduce((prev: boolean, regex: RegExp) => prev || regex.test(url), false);
  }
}
