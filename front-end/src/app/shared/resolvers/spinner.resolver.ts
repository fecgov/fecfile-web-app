import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { spinnerOffAction } from 'app/store/spinner.actions';

@Injectable({
  providedIn: 'root',
})
export class SpinnerResolver {
  constructor(private store: Store) {}

  /**
   * Returns the report record for the id passed in the URL
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot) {
    this.store.dispatch(spinnerOffAction());
  }
}
