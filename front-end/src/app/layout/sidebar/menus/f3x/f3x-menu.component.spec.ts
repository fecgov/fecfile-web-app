import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F3XMenuComponent } from './f3x-menu.component';
import { provideMockStore } from '@ngrx/store/testing';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('F3XMenuComponent', () => {
  let component: F3XMenuComponent;
  let fixture: ComponentFixture<F3XMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports/transactions/report/999/list',
            redirectTo: '',
          },
        ]),
        provideMockStore(testMockStore),
      ],
      imports: [PanelMenuModule, BrowserAnimationsModule, F3XMenuComponent],
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

  xit('should set the sidebar state to TRANSACTIONS', () => {
    component.items$.subscribe((items) => {
      expect(items[1].visible).toBeTrue();
    });
  });

  xit('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    component.activeReport$?.subscribe((report) => {
      expect(report?.id).toBe('999');
    });
  });
});
