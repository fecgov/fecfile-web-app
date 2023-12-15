import { ComponentFixture, TestBed } from '@angular/core/testing';
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
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { setSidebarStateAction } from 'app/store/sidebar-state.actions';
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

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

  it('should set showSidebar to true when location has a sidebar action', () => {
    store.dispatch(setSidebarStateAction({ payload: new SidebarState(ReportSidebarState.TRANSACTIONS, '/url') }));
    store
      .select(selectSidebarState)
      .pipe(filter((state) => !!state))
      .subscribe(() => {
        expect(component.showSidebar).toBeTruthy();
      });
  });

  it('should set showSidebar to false when location does not have a sidebar action', () => {
    store.dispatch(setSidebarStateAction({ payload: undefined }));
    store
      .select(selectSidebarState)
      .pipe(filter((state) => !!state))
      .subscribe(() => {
        expect(component.showSidebar).toBeFalsy();
      });
  });
});
