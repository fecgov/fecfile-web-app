import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { Store } from '@ngrx/store';
import { SidebarState } from 'app/layout/sidebar/sidebar.component';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';

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
  resolve(route: ActivatedRouteSnapshot): Observable<SidebarState | undefined> {
    const sidebarSection = route.data['sidebarSection'];
    let sidebarState: SidebarState | undefined;
    if (sidebarSection != undefined) {
      sidebarState = new SidebarState(sidebarSection);
    }
    this.store.dispatch(setSidebarStateAction({ payload: sidebarState }));
    return of(sidebarState);
  }
}
