import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportService } from 'app/shared/services/report.service';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { MessageService } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F24MenuComponent } from './f24-menu.component';

describe('F24MenuComponent', () => {
  let component: F24MenuComponent;
  let fixture: ComponentFixture<F24MenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        ReportService,
        MessageService,
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports/transactions/report/999/list',
            redirectTo: '',
          },
        ]),
        provideMockStore(testMockStore()),
      ],
      imports: [PanelMenuModule, BrowserAnimationsModule, F24MenuComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(F24MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the sidebar state to TRANSACTIONS', () => {
    expect(component.itemsSignal()[1].visible).toBeTrue();
  });

  it('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    expect(component.activeReport().id).toBe('999');
  });
});
