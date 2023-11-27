import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { ReportSidebarState, SidebarComponent, SidebarState } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuReportComponent } from './sidebar/menu-report/menu-report.component';
import { LayoutComponent } from './layout.component';
import { BannerComponent } from './banner/banner.component';
import { filter, Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { Event, NavigationEnd, Router } from "@angular/router";

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule],
      declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        BannerComponent,
        MenuReportComponent,
        FooterComponent,
        CommitteeBannerComponent,
      ],
      providers: [LayoutComponent, provideMockStore(testMockStore)],
    }).compileComponents();

    fixture = TestBed.createComponent(LayoutComponent);
    store = TestBed.inject(Store);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set the sidebar by default', waitForAsync(() => {
    component.sidebarState$?.subscribe((state) => expect(state).toBe(undefined));
  }));

  it('should set the sidebar to the transaction section', () => {
    store.dispatch(setSidebarStateAction({payload: new SidebarState(ReportSidebarState.TRANSACTIONS)}));
    component.sidebarState$
      ?.pipe(filter((state) => !!state))
      .subscribe((state) => expect(state?.section).toBe(ReportSidebarState.TRANSACTIONS));
  });

  it('should set isReports to false when location is base reports module', () => {
    const event = new NavigationEnd(42, '/reports', '/');
    (TestBed.inject(Router).events as Subject<Event>).next(event);
    expect(component.isReports).toBeFalsy();
  });

  it('should set isReports to true when location is reports module', () => {
    const event = new NavigationEnd(42, '/reports/transactions/report/3fa0fd7e-306e-4cb6-8c8d-9ff9306092a6/list', '/');
    (TestBed.inject(Router).events as Subject<Event>).next(event);
    expect(component.isReports).toBeTruthy();
  });

  it('should be visible only when showSidebar and isReports are both true', () => {
    expect(component.isVisible).toBeFalsy();
    component.showSidebar = true;
    const event = new NavigationEnd(42, '/reports/transactions/report/3fa0fd7e-306e-4cb6-8c8d-9ff9306092a6/list', '/');
    (TestBed.inject(Router).events as Subject<Event>).next(event);
    expect(component.isReports).toBeTruthy();
    expect(component.showSidebar).toBeTruthy();
    expect(component.isVisible).toBeTruthy();

    component.showSidebar = false;
    expect(component.isVisible).toBeFalsy();
  });
});
