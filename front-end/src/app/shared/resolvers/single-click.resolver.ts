import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { singleClickEnableAction } from 'app/store/single-click.actions';

@Injectable({
  providedIn: 'root',
})
export class SingleClickResolver {
  constructor(private store: Store) {}

  /**
   * Re-enables any singleClick buttons
   * @returns {Observable<Report | undefined>}
   */
  resolve() {
    this.store.dispatch(singleClickEnableAction());
  }
}
