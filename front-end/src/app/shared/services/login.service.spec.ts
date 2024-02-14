import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { userLoggedInAction, userLoggedOutAction, userLoggedOutForLoginDotGovAction } from 'app/store/login.actions';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { UserLoginData } from '../models/user.model';
import { LoginService } from './login.service';
import { DateUtils } from '../utils/date.utils';
import { selectUserLoginData } from 'app/store/login.selectors';

describe('LoginService', () => {
  let service: LoginService;
  let store: MockStore;
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, LoginService, CookieService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LoginService);
    store = TestBed.inject(MockStore);
    apiService = TestBed.inject(ApiService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#signIn should authenticate in the back end', () => {
    service.logIn('email@fec.gov', 'C00000000', 'test').subscribe(() => {
      expect(true).toBeTrue();
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/login/authenticate`);
    expect(req.request.method).toEqual('POST');
    req.flush(testUserLoginData);
    httpTestingController.verify();
  });

  it('should ping the API when requesting local login availability', () => {
    const spy = spyOn(apiService, 'get').and.returnValue(of({ endpoint_available: true }) as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    const result$ = service.checkLocalLoginAvailability();
    expect(spy).toHaveBeenCalledWith('/user/login/authenticate');
    result$.subscribe((value) => {
      expect(value).toBe(true);
    });
  });

  it('#logOut non-login.gov happy path', async () => {
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(apiService, 'postAbsoluteUrl').and.returnValue(of('test'));
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutAction());
    expect(apiService.postAbsoluteUrl).toHaveBeenCalledTimes(0);
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });

  //Can't figure out how to override service's userLoginData
  xit('#logOut login.gov happy path', () => {
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutForLoginDotGovAction());
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });

  it('userIsAuthenticated should return true', () => {
    service.userIsAuthenticated().then((userIsAuthenticated) => {
      expect(userIsAuthenticated).toBeTrue();
    });
  });

  it('userHasProfileData should return true', () => {
    service.userHasProfileData().then((userHasProfileData) => {
      expect(userHasProfileData).toBeTrue();
    });
  });

  describe('#userHasRecentSecurityConsentDate should work', () => {
    it('current date is valid', () => {
      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_date: DateUtils.convertDateToFecFormat(new Date()) as string,
      });
      service
        .userHasRecentSecurityConsentDate()
        .then((userHasRecentSecurityConsentDate) => expect(userHasRecentSecurityConsentDate).toBeTrue());
    });

    it('recent date is valid', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() - 6);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_date: testDate,
      });
      service
        .userHasRecentSecurityConsentDate()
        .then((userHasRecentSecurityConsentDate) => expect(userHasRecentSecurityConsentDate).toBeTrue());
    });

    it('364 days ago is valid', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() - 364);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_date: testDate,
      });
      service
        .userHasRecentSecurityConsentDate()
        .then((userHasRecentSecurityConsentDate) => expect(userHasRecentSecurityConsentDate).toBeTrue());
    });

    it('one year ago is invalid', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 1);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;
      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_date: testDate,
      });
      service
        .userHasRecentSecurityConsentDate()
        .then((userHasRecentSecurityConsentDate) => expect(userHasRecentSecurityConsentDate).toBeFalse());
    });
  });

  it('#dispatchUserLoggedInFromCookies happy path', () => {
    const testFirstName = 'testFirstName';
    const testLastName = 'testLastName';
    const testEmail = 'testEmail';
    const testLoginDotGov = false;
    const testSecurityConsentDate = DateUtils.convertDateToFecFormat(new Date()) as string;

    const expectedUserLoginData: UserLoginData = {
      first_name: testFirstName,
      last_name: testLastName,
      email: testEmail,
      login_dot_gov: testLoginDotGov,
      security_consent_date: testSecurityConsentDate,
    };
    spyOn(cookieService, 'check').and.returnValue(true);
    spyOn(cookieService, 'get').and.callFake((name: string) => {
      if (name === environment.ffapiFirstNameCookieName) {
        return testFirstName;
      }
      if (name === environment.ffapiLastNameCookieName) {
        return testLastName;
      }
      if (name === environment.ffapiEmailCookieName) {
        return testEmail;
      }
      if (name === environment.ffapiLoginDotGovCookieName) {
        return testLoginDotGov.toString();
      }
      if (name === environment.ffapiSecurityConsentCookieName) {
        return testSecurityConsentDate;
      }
      throw Error('fail!');
    });
    spyOn(store, 'dispatch');

    service.dispatchUserLoggedInFromCookies();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedInAction({ payload: expectedUserLoginData }));
  });
});
