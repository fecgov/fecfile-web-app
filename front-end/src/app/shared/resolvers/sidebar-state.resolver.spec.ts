import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SidebarStateResolver } from './sidebar-state.resolver';
import { Store } from '@ngrx/store';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { ReportSidebarState, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { initialState as initSidebarState } from 'app/store/sidebar-state.reducer';

describe('SidebarStateResolver', () => {
  let resolver: SidebarStateResolver;
  let store: Store;

  const mockStore = {
    initialState: {
      fecfile_online_sidebarState: initSidebarState,
    },
    selectors: [{ selector: selectSidebarState, value: new SidebarState(ReportSidebarState.TRANSACTIONS, '/url') }],
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore(mockStore)],
    });
    store = TestBed.inject(Store);
    resolver = TestBed.inject(SidebarStateResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should return an F3X report', () => {
    const route = {
      data: {
        sidebarState: 0,
      },
    };
    const routeState = {
      url: '/url',
    };
    resolver
      .resolve(route as unknown as ActivatedRouteSnapshot, routeState as RouterStateSnapshot)
      .subscribe((response) => {
        expect(response).toBeUndefined();

        store.select(selectSidebarState).subscribe((data) => {
          expect(data.section).toBe(ReportSidebarState.TRANSACTIONS);
          expect(data.url).toBe('/url');
        });
      });
  });
});