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
import { SECURITY_CONSENT_VERSION } from 'app/login/security-notice/security-notice.component';
import { environment } from 'environments/environment';

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
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    store.overrideSelector(selectUserLoginData, testUserLoginData());
    service.logOut();
    expect(dispatchSpy).toHaveBeenCalledWith(userLoginDataDiscardedAction());
  });

  it('#logOut login.gov happy path', () => {
    const dispatchSpy = vi.spyOn(store, 'dispatch');
    const originalLogoutUrl = environment.loginDotGovLogoutUrl;
    environment.loginDotGovLogoutUrl = globalThis.location.href;
    const userIsAuthenticatedSpy = vi.spyOn(service, 'userIsAuthenticated').mockReturnValue(true);

    try {
      service.logOut();
      expect(dispatchSpy).toHaveBeenCalledWith(userLoginDataDiscardedAction());
      expect(userIsAuthenticatedSpy).toHaveBeenCalled();
    } finally {
      environment.loginDotGovLogoutUrl = originalLogoutUrl;
    }
  });

  it('userHasProfileData should return true', () => {
    expect(service.userHasProfileData()).toBe(true);
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
      expect(service.userHasConsented()).toBe(false);
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
      expect(service.userHasConsented()).toBe(false);
    });

    it('test true security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consented: true,
        security_consent_version: SECURITY_CONSENT_VERSION + 'B',
        security_consent_version_at_login: SECURITY_CONSENT_VERSION,
      });
      expect(service.userHasConsented()).toBe(false);
    });

    it('test true security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consented: true,
        security_consent_version: SECURITY_CONSENT_VERSION + 'B',
        security_consent_version_at_login: SECURITY_CONSENT_VERSION + 'B',
      });
      expect(service.userHasConsented()).toBe(true);
    });

    it('test true security_consented', () => {
      const one_day_ahead = new Date();
      one_day_ahead.setDate(one_day_ahead.getDate() + 1);

      store.overrideSelector(selectUserLoginData, {
        first_name: '',
        last_name: '',
        email: '',
        security_consented: true,
        security_consent_version: SECURITY_CONSENT_VERSION,
        security_consent_version_at_login: SECURITY_CONSENT_VERSION,
      });
      expect(service.userHasConsented()).toBe(true);
    });
  });
});
