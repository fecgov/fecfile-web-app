import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F99MenuComponent } from './f99-menu.component';
import { ReportSidebarState, SidebarState } from '../../sidebar.component';
import { Store } from '@ngrx/store';
import { initialState as initSidebarState } from 'app/store/sidebar-state.reducer';
import { selectSidebarState } from 'app/store/sidebar-state.selectors';

describe('F99MenuComponent', () => {
  let component: F99MenuComponent;
  let fixture: ComponentFixture<F99MenuComponent>;
  let router: Router;

  const mockStore = {
    initialState: {
      fecfile_online_sidebarState: initSidebarState,
    },
    selectors: [{ selector: selectSidebarState, value: new SidebarState(ReportSidebarState.REVIEW, '/url') }],
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [F99MenuComponent],
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
    fixture = TestBed.createComponent(F99MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the sidebar state to REVIEW A REPORT', () => {
    component.items$.subscribe((items) => {
      expect(items[1].expanded).toBeTrue();
    });
  });

  it('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    component.activeReport$?.subscribe((report) => {
      expect(report?.id).toBe('999');
    });
  });
});
