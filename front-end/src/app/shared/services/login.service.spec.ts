import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { Router } from '@angular/router';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let store: MockStore;
  let cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        ApiService,
        LoginService,
        provideMockStore(testMockStore()),
      ],
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

    service.userLoginData$ = of(testUserLoginData());
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
    it('test undefined security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeFalse());
    });

    it('test false security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consented: false,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeFalse());
    });

    it('test true security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consented: true,
      });
      service.userHasConsented().then((userHasConsented) => expect(userHasConsented).toBeTrue());
    });
  });
});
