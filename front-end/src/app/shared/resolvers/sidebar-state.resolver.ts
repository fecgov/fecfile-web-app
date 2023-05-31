import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';

@Injectable({
  providedIn: 'root',
})
export class SidebarStateResolver implements Resolve<SidebarState | undefined> {
  constructor(private store: Store) {}

  /**
   * Saves SidebarState to Store
   * @param {ActivatedRouteSnapshot} route
   * @returns {Observable<Report | undefined>}
   */
  resolve(route: ActivatedRouteSnapshot): Observable<SidebarState | undefined> {
    const sidebarState = route.data['sidebarState'];
    this.store.dispatch(setSidebarStateAction({ payload: sidebarState }));
    return of(sidebarState);
  }
}
