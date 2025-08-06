import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testMockStore, testUserLoginData } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { Router } from '@angular/router';
import { userLoginDataDiscardedAction } from 'app/store/user-login-data.actions';
import { selectUserLoginData } from 'app/store/user-login-data.selectors';
import { LoginService } from './login.service';
import { provideHttpClient } from '@angular/common/http';

describe('LoginService', () => {
  let service: LoginService;
  let store: MockStore;

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
    TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#logOut non-login.gov happy path', async () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    store.overrideSelector(selectUserLoginData, testUserLoginData());
    service.logOut();
    expect(dispatchSpy).toHaveBeenCalledWith(userLoginDataDiscardedAction());
  });

  it('#logOut login.gov happy path', () => {
    spyOn(store, 'dispatch');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoginDataDiscardedAction());
  });

  it('userHasProfileData should return true', () => {
    expect(service.userHasProfileData()).toBeTrue();
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
      expect(service.userHasConsented()).toBeFalse();
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
      expect(service.userHasConsented()).toBeFalse();
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
      expect(service.userHasConsented()).toBeTrue();
    });
  });
});
