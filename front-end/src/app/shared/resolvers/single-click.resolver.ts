import { inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { singleClickEnableAction } from 'app/store/single-click.actions';

@Injectable({
  providedIn: 'root',
})
export class SingleClickResolver {
  private readonly store = inject(Store);

  /**
   * Re-enables any singleClick buttons
   *
   */
  resolve() {
    this.store.dispatch(singleClickEnableAction());
  }
}
