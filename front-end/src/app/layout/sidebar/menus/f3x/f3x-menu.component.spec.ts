import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F3XMenuComponent } from './f3x-menu.component';
import { ReportSidebarSection, SidebarState } from '../../sidebar.component';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';
import { initialState as initSidebarState } from 'app/store/sidebar-state.reducer';

describe('F3XMenuComponent', () => {
  let component: F3XMenuComponent;
  let fixture: ComponentFixture<F3XMenuComponent>;
  let router: Router;

  const mockStore = {
    initialState: {
      fecfile_online_sidebarState: initSidebarState,
    },
    selectors: [{ selector: selectSidebarState, value: new SidebarState(ReportSidebarSection.TRANSACTIONS) }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [F3XMenuComponent],
      providers: [provideMockStore(mockStore)],
      imports: [
        SharedModule,
        PanelMenuModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'reports/transactions/report/999/list',
            redirectTo: '',
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(F3XMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the sidebar state to TRANSACTIONS', () => {
    component.items$.subscribe((items) => {
      expect(items[1].visible).toBeTrue();
    });
  });

  it('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    component.activeReport$?.subscribe((report) => {
      expect(report?.id).toBe('999');
    });
  });
});
