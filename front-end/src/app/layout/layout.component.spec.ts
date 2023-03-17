import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MenubarModule } from 'primeng/menubar';
import { SidebarComponent } from './sidebar/sidebar.component';
import { FooterComponent } from './footer/footer.component';
import { HeaderComponent } from './header/header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MenuReportComponent } from './sidebar/menu-report/menu-report.component';
import { LayoutComponent } from './layout.component';
import { NavigationEnd } from '@angular/router';
import { BannerComponent } from './banner/banner.component';

describe('LayoutComponent', () => {
  let component: LayoutComponent;
  let fixture: ComponentFixture<LayoutComponent>;

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

    fixture = TestBed.createComponent(LayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show or hide the sidebar based on the page', () => {
    const navigationEvent = new NavigationEnd(1, '', '');

    navigationEvent.url = '/reports/f3x/summary/1234-5678';
    component.handleNavigationEvent(navigationEvent);
    expect(component.sidebarVisible).toBe(true);

    navigationEvent.url = '/contacts';
    component.handleNavigationEvent(navigationEvent);
    expect(component.sidebarVisible).toBe(false);
  });
});
