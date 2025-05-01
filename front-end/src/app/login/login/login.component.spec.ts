import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideRouter } from '@angular/router';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { BannerComponent } from 'app/layout/banner/banner.component';
import { testMockStore } from 'app/shared/utils/unit-test.utils';
import { environment } from 'environments/environment';
import { LoginComponent } from './login.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async () => {
    window.onbeforeunload = jasmine.createSpy();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, LoginComponent, BannerComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Window, useValue: window },
        provideMockStore(testMockStore),
        provideRouter([
          {
            path: 'reports',
            component: ReportListComponent,
          },
        ]),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  xit('navigateToLoginDotGov should href environment location', () => {
    component.navigateToLoginDotGov();
    expect(window.location.href).toEqual(environment.loginDotGovAuthUrl);
  });
});
