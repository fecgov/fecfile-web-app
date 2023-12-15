import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuReportComponent } from './menu-report.component';
import { ReportSidebarState, SidebarState } from '../sidebar.component';
import { combineLatest, filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

describe('MenuReportComponent', () => {
  let component: MenuReportComponent;
  let fixture: ComponentFixture<MenuReportComponent>;
  let router: Router;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuReportComponent],
      providers: [provideMockStore(testMockStore)],
      imports: [
        SharedModule,
        PanelMenuModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'reports/transactions/report/999/list',
            redirectTo: '',
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(MenuReportComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(Store);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the sidebar state to TRANSACTIONS', waitForAsync(() => {
    store.dispatch(
      setSidebarStateAction({
        payload: new SidebarState(ReportSidebarState.TRANSACTIONS, 'reports/transactions/report/999/list'),
      })
    );
    const waitUntilSidebarState = store.select(selectSidebarState).pipe(filter((state) => !!state));
    combineLatest([component.items$, waitUntilSidebarState]).subscribe(([items, _]) => {
      expect(_.section).toBe(ReportSidebarState.TRANSACTIONS);
      expect(items[0].visible).toBeTrue();
    });
  }));

  it('should set the sidebar state to REVIEW', waitForAsync(() => {
    store.dispatch(setSidebarStateAction({ payload: new SidebarState(ReportSidebarState.REVIEW, '/url2') }));
    const waitUntilSidebarState = store.select(selectSidebarState).pipe(filter((state) => !!state));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    combineLatest([component.items$, waitUntilSidebarState]).subscribe(([items, _]) => {
      expect(items[1].visible).toBeTrue();
    });
  }));

  it('should set the sidebar state to SUBMISSION', waitForAsync(() => {
    store.dispatch(setSidebarStateAction({ payload: new SidebarState(ReportSidebarState.REVIEW, '/url3') }));
    const waitUntilSidebarState = store.select(selectSidebarState).pipe(filter((state) => !!state));
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    combineLatest([component.items$, waitUntilSidebarState]).subscribe(([items, _]) => {
      expect(items[2].visible).toBeTrue();
    });
  }));

  it('should get report from url', waitForAsync(() => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    component.activeReport$?.subscribe((report) => {
      expect(report?.id).toBe('999');
    });
  }));
});
