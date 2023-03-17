import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { Report } from '../interfaces/report.interface';
import { ReportService } from '../services/report.service';

@Injectable({
  providedIn: 'root',
})
export class ReportSidebarResolver implements Resolve<string | undefined> {
  urlMatch: RegExp[] = [
    /^\/reports\/f3x\/create\/cash-on-hand\/[\da-z-]+/, // Enter a transaction group
    /^\/transactions\/report\/[\da-z-]+\/list/, // Enter a transaction group
    /^\/transactions\/report\/[\da-z-]+\/select/, // Select a transaction category
    /^\/transactions\/report\/[\da-z-]+\/create/, // Enter a transaction type
    /^\/reports\/f3x\/summary\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/detailed-summary\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/web-print\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/memo\/[\da-z-]+/, // Review a report group
    /^\/reports\/f3x\/submit\/step1\/[\da-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/step2\/[\da-z-]+/, // Submit your report group
    /^\/reports\/f3x\/submit\/status\/[\da-z-]+/, // Submit your report group
  ];

  constructor(private store: Store, private reportService: ReportService) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<string | undefined> {
    console.log(route);
    const url = route.pathFromRoot.toString();

    if (this.isActive(this.urlMatch.slice(0, 4), url)) {
      return of('Transactions');
    } else if (this.isActive(this.urlMatch.slice(4, 7), url)) {
      return of('Review');
    } else if (this.isActive(this.urlMatch.slice(7, 10), url)) {
      return of('Submission');
    }

    return of('None');
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
