import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideMockStore } from '@ngrx/store/testing';
import { ReportListComponent } from 'app/reports/report-list/report-list.component';
import { UsersService } from 'app/shared/services/users.service';
import { testMockStore, testUserLoginData } from 'app/shared/utils/unit-test.utils';
import { LoginService } from '../../shared/services/login.service';
import { SecurityNoticeComponent } from './security-notice.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';

describe('SecurityNoticeComponent', () => {
  let component: SecurityNoticeComponent;
  let fixture: ComponentFixture<SecurityNoticeComponent>;
  let usersService: UsersService;

  beforeEach(async () => {
    window.onbeforeunload = jasmine.createSpy();
    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, SecurityNoticeComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideRouter([
          {
            path: 'reports',
            component: ReportListComponent,
          },
        ]),
        { provide: Window, useValue: window },
        provideMockStore(testMockStore),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecurityNoticeComponent);
    TestBed.inject(LoginService);
    usersService = TestBed.inject(UsersService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should submit', () => {
    const spy = spyOn(usersService, 'updateCurrentUser').and.returnValue(Promise.resolve(testUserLoginData));
    component.signConsentForm();
    const expectedUserLoginData = testUserLoginData;
    expect(spy).toHaveBeenCalledOnceWith(expectedUserLoginData);

    expectedUserLoginData.consent_for_one_year = true;
    component.form.get('security-consent-annual')?.setValue(true);
    component.signConsentForm();
    expect(spy).toHaveBeenCalledWith(expectedUserLoginData);
  });
});
