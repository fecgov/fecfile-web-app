import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter, Router } from '@angular/router';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F99MenuComponent } from './f99-menu.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { provideMockStore } from '@ngrx/store/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('F99MenuComponent', () => {
  let component: F99MenuComponent;
  let fixture: ComponentFixture<F99MenuComponent>;
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
      imports: [PanelMenuModule, BrowserAnimationsModule, F99MenuComponent],
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

  xit('should set the sidebar state to REVIEW A REPORT', () => {
    expect(component.itemsSignal()[1].expanded).toBeTrue();
  });

  xit('should get report from url', () => {
    router.navigateByUrl('/reports/transactions/report/999/list');
    expect(component.activeReport().id).toBe('999');
  });
});
