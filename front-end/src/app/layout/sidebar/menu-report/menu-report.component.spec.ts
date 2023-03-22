import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { ActivatedRouteSnapshot, ActivationStart, Event, NavigationEnd, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuReportComponent } from './menu-report.component';
import { ReportSidebarState } from '../sidebar.component';
import { Subject } from 'rxjs';

describe('MenuReportComponent', () => {
  let component: MenuReportComponent;
  let fixture: ComponentFixture<MenuReportComponent>;
  let router: Router;

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
            path: 'transactions/report/999/list',
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('the sidebar state should be undefined by default', () => {
    expect(component.sidebarState).toBe(undefined);
  });

  it('should set the sidebar state to TRANSACTIONS', () => {
    const events$ = router.events as Subject<Event>;
    const routerSnapshot = {
      data: {
        sidebar: {
          sidebarState: ReportSidebarState.TRANSACTIONS,
        },
      },
    } as unknown as ActivatedRouteSnapshot;
    events$.next(new ActivationStart(routerSnapshot));

    expect(component.sidebarState).toBe(ReportSidebarState.TRANSACTIONS);
  });

  it('should set the sidebar state to REVIEW', () => {
    const events$ = router.events as Subject<Event>;
    const routerSnapshot = {
      data: {
        sidebar: {
          sidebarState: ReportSidebarState.REVIEW,
        },
      },
    } as unknown as ActivatedRouteSnapshot;
    events$.next(new ActivationStart(routerSnapshot));

    expect(component.sidebarState).toBe(ReportSidebarState.REVIEW);
  });

  it('should set the sidebar state to SUBMISSION', () => {
    const events$ = router.events as Subject<Event>;
    const routerSnapshot = {
      data: {
        sidebar: {
          sidebarState: ReportSidebarState.SUBMISSION,
        },
      },
    } as unknown as ActivatedRouteSnapshot;
    events$.next(new ActivationStart(routerSnapshot));

    expect(component.sidebarState).toBe(ReportSidebarState.SUBMISSION);
  });

  it('should navigate to menu', () => {
    router.navigateByUrl('/transactions/report/999/list');
    expect(component.activeReport?.id).toBe('999');
  });

  it('should process a NavigationEnd event', () => {
    component.items = [];
    component.currentReportId = '888';
    component.handleNavigationEvent({ url: '/transactions/report/999/list' } as NavigationEnd);
    expect(component.items.length).toBe(3);
  });
});
