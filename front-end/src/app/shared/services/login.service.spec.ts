import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
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
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, LoginService, provideMockStore(testMockStore)],
    });
    service = TestBed.inject(LoginService);
    store = TestBed.inject(MockStore);
    cookieService = TestBed.inject(CookieService);
    TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#logOut non-login.gov happy path', async () => {
    TestBed.resetTestingModule();

    const dispatchSpy = spyOn(store, 'dispatch');

    service.userLoginData$ = of(testUserLoginData);
    service.logOut();
    expect(dispatchSpy).toHaveBeenCalledWith(userLoginDataDiscardedAction());
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
