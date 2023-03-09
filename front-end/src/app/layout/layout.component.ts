import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectCommitteeAccount } from '../store/committee-account.selectors';
import { selectSpinnerStatus } from '../store/spinner.selectors';
import { CommitteeAccount } from 'app/shared/models/committee-account.model';
import { NavigationEnd, Router, Event } from '@angular/router';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent implements OnInit, OnDestroy {
  committeeAccount$: Observable<CommitteeAccount> | undefined;
  progressBarVisible$: Observable<{ spinnerOn: boolean }> | undefined;
  sidebarVisible = false;
  private destroy$ = new Subject<boolean>();

  // The order of the url regular expressions listed inthe urlMatch array is important
  // because the order determines the expanded menu item group in the panal menu:
  // 'Enter A Transaction', 'Review A Report', and 'Submit Your Report'.
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

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    this.committeeAccount$ = this.store.select(selectCommitteeAccount);
    this.progressBarVisible$ = this.store.select(selectSpinnerStatus);

    // Watch the router changes and display menu if URL is in urlMatch list.
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.handleNavigationEvent(event);
      }
    });
  }

  handleNavigationEvent(event: NavigationEnd) {
    // Show the sidebar report menu if the router url matches one of the url
    // regular expressions in the matchUrl array.
    this.sidebarVisible = this.isActive(this.urlMatch, event.url);
    console.log(this.sidebarVisible);
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

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
