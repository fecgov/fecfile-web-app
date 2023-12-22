import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { spinnerOffAction } from 'app/store/spinner.actions';

@Injectable({
  providedIn: 'root',
})
export class SpinnerResolver {
  constructor(private store: Store) {}

  /**
   * Returns the report record for the id passed in the URL
   * @returns {Observable<Report | undefined>}
   */
  resolve() {
    this.store.dispatch(spinnerOffAction());
  }
}
