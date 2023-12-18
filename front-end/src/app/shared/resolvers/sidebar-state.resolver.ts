import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, map } from 'rxjs';
import { Store } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateResolver {
  constructor(private store: Store) {}

  /**
   * Saves SidebarState to Store
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot, routeState: RouterStateSnapshot): Observable<SidebarState | undefined> {
    // Ignore state changes unless there is a url available.
    return this.store.select(selectSidebarState).pipe(
      map((state) => {
        // Don't update sidebar state if click is to same route
        if (state.url !== routeState.url || route.data['sidebarState'] !== undefined) {
          const sidebarState = new SidebarState(route.data['sidebarState'], routeState.url);
          this.store.dispatch(setSidebarStateAction({ payload: sidebarState }));
        }
        // Only use the sidebarState value in the store.
        return undefined;
      })
    );
  }
}
