import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../../shared/shared.module';
import { PanelMenuModule } from 'primeng/panelmenu';
import { F1MMenuComponent } from './f1m-menu.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';

describe('F1MMenuComponent', () => {
  let component: F1MMenuComponent;
  let fixture: ComponentFixture<F1MMenuComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [F1MMenuComponent],
      providers: [provideMockStore(testMockStore)],
      imports: [
        SharedModule,
        PanelMenuModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        RouterTestingModule.withRoutes([
          {
            path: 'reports/f1m/edit/4c0c25c9-6e14-48bc-8758-42ee55599f93',
            redirectTo: '',
          },
        ]),
      ],
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

  xit('should set the sidebar state to REVIEW A REPORT', () => {
    component.items$.subscribe((items) => {
      expect(items[1].expanded).toBeTrue();
    });
  });

  xit('should get report from url', () => {
    router.navigateByUrl('/reports/f1m/edit/4c0c25c9-6e14-48bc-8758-42ee55599f93');
    component.activeReport$?.subscribe((report) => {
      expect(report?.id).toBe('999');
    });
  });
});
