import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { Router } from '@angular/router';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { DateUtils } from '../utils/date.utils';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let store: MockStore;
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, LoginService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LoginService);
    store = TestBed.inject(MockStore);
    apiService = TestBed.inject(ApiService);
    cookieService = TestBed.inject(CookieService);
    TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#signIn should authenticate in the back end', () => {
    service.logIn('email@fec.gov', 'C00000000', 'test').then(() => {
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

    const dispatchSpy = spyOn(store, 'dispatch');
    const postSpy = spyOn(apiService, 'postAbsoluteUrl').and.returnValue(of('test'));

    service.userLoginData$ = of(testUserLoginData);
    service.logOut();
    expect(dispatchSpy).toHaveBeenCalledWith(userLoginDataDiscardedAction());
    expect(postSpy).toHaveBeenCalledTimes(0);
  });

  //Can't figure out how to override service's userLoginData
  xit('#logOut login.gov happy path', () => {
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoginDataDiscardedAction());
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });

  it('hasUserLoginData should return true', () => {
    service.hasUserLoginData().then((userHasProfileData) => {
      expect(userHasProfileData).toBeTrue();
    });
  });

  it('userHasProfileData should return true', () => {
    service.userHasProfileData().then((userHasProfileData) => {
      expect(userHasProfileData).toBeTrue();
    });
  });

  describe('#userHasConsented should work', () => {
    const one_year_ahead = new Date();
    one_year_ahead.setFullYear(one_year_ahead.getFullYear() + 1);

    it('expiration one day ahead is recent', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_exp_date: DateUtils.convertDateToFecFormat(one_day_ahead) as string,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeTrue());
    });

    it('expiration six months ahead is recent', () => {
      const recentDate = new Date();
      recentDate.setMonth(recentDate.getMonth() + 6);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_exp_date: testDate,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeTrue());
    });

    it('expiration 364 days ahead is recent', () => {
      const recentDate = new Date();
      recentDate.setDate(recentDate.getDate() + 364);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_exp_date: testDate,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeTrue());
    });

    it('expiration one year ago is not recent', () => {
      const recentDate = new Date();
      recentDate.setFullYear(recentDate.getFullYear() - 1);
      const testDate = DateUtils.convertDateToFecFormat(recentDate) as string;
      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_exp_date: testDate,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeFalse());
    });

    it('test undefined security_consent_exp_date', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consent_exp_date: undefined,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeFalse());
    });
  });
});
