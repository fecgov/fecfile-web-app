import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { SidebarComponent } from './sidebar.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MenuModule } from 'primeng/menu';
import { PanelMenuModule } from 'primeng/panelmenu';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { REPORTS_ROUTES } from 'app/reports/routes';
import { ReportSidebarSection } from './menu-info';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;
  let route: ActivatedRoute;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, MenuModule, PanelMenuModule, SidebarComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter(REPORTS_ROUTES),
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    route = TestBed.inject(ActivatedRoute);
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('items() should return report.getMenuItems() based on route data sidebarSection', () => {
    route.snapshot.data = {
      sidebarSection: ReportSidebarSection.REVIEW,
    };

    fixture.detectChanges();
    const items = component.items();

    expect(items.length).toBeGreaterThan(0);
    expect(items[0].label).toBeDefined();
  });

  it('formLabel() should come directly from active report', () => {
    expect(component.formLabel()).toBe('Form 3X');
    expect(component.subHeading()).toBe('APRIL 15 QUARTERLY REPORT (Q1)');
  });

  it('hasCoverage true for F3X', () => {
    expect(component.hasCoverage()).toBeTrue();
    expect(component.coverageThrough()!.toISOString().substring(0, 10)).toBe('2022-06-30');
  });
});
