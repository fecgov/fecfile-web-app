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
import { Router } from '@angular/router';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let router: Router;
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
      ],
      providers: [LayoutComponent, provideMockStore(testMockStore)],
    }).compileComponents();

    router = TestBed.inject(Router);
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
    store.dispatch(setSidebarStateAction({ payload: new SidebarState(ReportSidebarState.TRANSACTIONS) }));
    component.sidebarState$
      ?.pipe(filter((state) => !!state))
      .subscribe((state) => expect(state?.section).toBe(ReportSidebarState.TRANSACTIONS));
  });
});
