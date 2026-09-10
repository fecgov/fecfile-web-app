import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { UsersService } from 'app/shared/services/users.service';
import { testMockStore, testUserLoginData } from 'app/shared/utils/unit-test.utils';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { SECURITY_CONSENT_VERSION, SecurityNoticeFormComponent } from './security-notice-form.component';
import { LoginService } from 'app/shared/services/login.service';
import { submit } from '@angular/forms/signals';
import { Component, viewChild } from '@angular/core';

@Component({
  imports: [SecurityNoticeFormComponent],
  standalone: true,
  template: `<app-security-notice-form [hasScrolledToBottom]="hasScrolledToBottom" />`,
})
class TestHostComponent {
  component = viewChild.required(SecurityNoticeFormComponent);
  hasScrolledToBottom = false;
}

describe('SecurityNoticeFormComponent', () => {
  let component: SecurityNoticeFormComponent;
  let host: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    window.onbeforeunload = vi.fn();
    await TestBed.configureTestingModule({
      imports: [SecurityNoticeFormComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports',
            component: ReportListComponent,
          },
        ]),
        { provide: Window, useValue: globalThis },
        provideMockStore(testMockStore()),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    TestBed.inject(LoginService);
    usersService = TestBed.inject(UsersService);
    fixture = TestBed.createComponent(TestHostComponent);
    host = fixture.componentInstance;
    component = host.component();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be disabled until scroll to bottom', () => {
    const expectedUserLoginData = testUserLoginData();
    expectedUserLoginData.consent_for_one_year = false;
    const spy = vi.spyOn(usersService, 'updateCurrentUser').mockResolvedValue(expectedUserLoginData);
    submit(component.form);
    expect(spy).not.toHaveBeenCalled();
  });

  it('should submit', () => {
    const expectedUserLoginData = testUserLoginData();
    expectedUserLoginData.consent_for_one_year = false;
    const spy = vi.spyOn(usersService, 'updateCurrentUser').mockResolvedValue(expectedUserLoginData);
    host.hasScrolledToBottom = true;
    fixture.detectChanges();
    submit(component.form);

    expect(spy).toHaveBeenCalledWith(expectedUserLoginData);
    expect(component.userLoginData().security_consent_version_at_login).toBe(SECURITY_CONSENT_VERSION);
  });

  it('should submit wiith 1 year consent', () => {
    const expectedUserLoginData = testUserLoginData();
    expectedUserLoginData.consent_for_one_year = true;
    const spy = vi.spyOn(usersService, 'updateCurrentUser').mockResolvedValue(expectedUserLoginData);
    host.hasScrolledToBottom = true;
    component.form.annualConsent().value.set(true);
    fixture.detectChanges();
    submit(component.form);

    expect(spy).toHaveBeenCalledWith(expectedUserLoginData);
  });
});
