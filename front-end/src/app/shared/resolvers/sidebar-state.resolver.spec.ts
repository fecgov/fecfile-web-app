import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { SidebarStateResolver } from './sidebar-state.resolver';
import { Store } from '@ngrx/store';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { ReportSidebarSection, SidebarState } from 'app/layout/sidebar/sidebar.component';
import { initialState as initSidebarState } from 'app/store/sidebar-state.reducer';

describe('SidebarStateResolver', () => {
  let resolver: SidebarStateResolver;
  let store: Store;

  const mockStore = {
    initialState: {
      fecfile_online_sidebarState: initSidebarState,
    },
    selectors: [{ selector: selectSidebarState, value: new SidebarState(ReportSidebarSection.TRANSACTIONS) }],
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
    resolver.resolve(route as unknown as ActivatedRouteSnapshot).subscribe((response) => {
      expect(response).toBeUndefined();

      store.select(selectSidebarState).subscribe((data) => {
        expect(data.section).toBe(ReportSidebarSection.TRANSACTIONS);
      });
    });
  });
});
