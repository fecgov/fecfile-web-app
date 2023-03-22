import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { SidebarComponent, Sidebars } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuReportComponent } from './sidebar/menu-report/menu-report.component';
import { LayoutComponent } from './layout.component';
import { BannerComponent } from './banner/banner.component';
import { ActivatedRouteSnapshot, ActivationStart, Event, Router } from '@angular/router';
import { Subject } from 'rxjs';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;
  let router: Router;

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
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not set the sidebar by default', () => {
    expect(component.sidebar).toBe(undefined);
  });

  it('should set the sidebar to the report sidebar', () => {
    const events$ = router.events as Subject<Event>;
    const routerSnapshot = {
      data: {
        sidebar: {
          sidebar: Sidebars.REPORT,
        },
      },
    } as unknown as ActivatedRouteSnapshot;
    events$.next(new ActivationStart(routerSnapshot));

    expect(component.sidebar).toBe(Sidebars.REPORT);
  });
});
