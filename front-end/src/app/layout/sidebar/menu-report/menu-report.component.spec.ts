import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { selectActiveReport } from 'app/store/active-report.selectors';
import { selectReportCodeLabelList } from 'app/store/label-lookup.selectors';
import { F3xSummary } from '../../../shared/models/f3x-summary.model';
import { SharedModule } from '../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { MenuReportComponent } from './menu-report.component';

describe('MenuReportComponent', () => {
  let component: MenuReportComponent;
  let fixture: ComponentFixture<MenuReportComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuReportComponent],
      providers: [
        provideMockStore({
          initialState: {
            fecfile_online_activeReport: { id: 888 } as F3xSummary,
            fecfile_online_reportCodeLabelList: [],
          },
          selectors: [
            { selector: selectActiveReport, value: { id: 999 } as F3xSummary },
            { selector: selectReportCodeLabelList, value: [] },
          ],
        }),
      ],
      imports: [
        SharedModule,
        PanelMenuModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([{ path: 'reports/f3x/create/step3/999', redirectTo: '' }]),
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

  it('should navigate to menu', () => {
    router.navigateByUrl('/reports/f3x/create/step3/999');
    expect(component.activeReport?.id).toBe(999);
  });
});
