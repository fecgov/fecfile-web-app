import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F1MMenuComponent } from './f1m-menu.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ReportSidebarSection } from '../../sidebar.component';
import { MainFormComponent } from 'app/reports/f1m/main-form/main-form.component';
import { ReportService } from 'app/shared/services/report.service';

describe('F1MMenuComponent', () => {
  let component: F1MMenuComponent;
  let fixture: ComponentFixture<F1MMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'edit/:reportId',
            component: MainFormComponent,
            data: { sidebarSection: ReportSidebarSection.CREATE },
          },
        ]),
        provideMockStore(testMockStore),
        ReportService,
      ],
      imports: [PanelMenuModule, BrowserAnimationsModule, F1MMenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(F1MMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get report from url', () => {
    router.navigateByUrl('/reports/f1m/edit/4c0c25c9-6e14-48bc-8758-42ee55599f93');
    expect(component.activeReportSignal().id).toBe('999');
  });

  xit('should set the sidebar state to REVIEW A REPORT', async () => {
    await router.navigateByUrl('edit/4c0c25c9-6e14-48bc-8758-42ee55599f93');
    const items = component.itemsSignal();
    console.log(items);
    expect(component.itemsSignal()[1].expanded).toBeTrue();
  });
});
