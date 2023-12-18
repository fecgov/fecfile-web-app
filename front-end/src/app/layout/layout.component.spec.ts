import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
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
import { CommitteeBannerComponent } from './committee-banner/committee-banner.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { SharedModule } from 'app/shared/shared.module';
import { initialState as initSidebarState } from 'app/store/sidebar-state.reducer';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let store: Store;

  const mockStore = {
    initialState: {
      fecfile_online_sidebarState: initSidebarState,
    },
    selectors: [{ selector: selectSidebarState, value: new SidebarState(ReportSidebarState.TRANSACTIONS, '/url') }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenubarModule, HttpClientTestingModule, RouterTestingModule, SharedModule],
      declarations: [
        LayoutComponent,
        SidebarComponent,
        HeaderComponent,
        BannerComponent,
        MenuReportComponent,
        FooterComponent,
        CommitteeBannerComponent,
      ],
      providers: [LayoutComponent, provideMockStore(mockStore)],
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
    store
      .select(selectSidebarState)
      .pipe(filter((state) => !!state))
      .subscribe(() => {
        expect(component.showSidebar).toBeTruthy();
      });
  });
});
