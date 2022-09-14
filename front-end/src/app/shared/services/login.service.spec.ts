import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { testUserLoginData, testMockStore } from '../utils/unit-test.utils';
import { UserLoginData } from 'app/shared/models/user.model';
import { environment } from 'environments/environment';
import { ApiService } from './api.service';

import { userLoggedOutAction, userLoggedOutForLoginDotGovAction } from 'app/store/login.actions';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
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
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#signIn should authenticate in the back end', () => {
    service.signIn('email@fec.gov', 'C00000000', 'test').subscribe((response: UserLoginData) => {
      expect(response).toEqual(testUserLoginData);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/login/authenticate`);
    expect(req.request.method).toEqual('POST');
    req.flush(testUserLoginData);
    httpTestingController.verify();
  });

  it('#validateCode should verify code in the back end', () => {
    service.validateCode('jwttokenstring').subscribe((response: UserLoginData) => {
      expect(response).toEqual(testUserLoginData);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/login/verify`);
    expect(req.request.method).toEqual('POST');
    req.flush(testUserLoginData);
    httpTestingController.verify();
  });

  it('should ping the API when requesting local login availability', () => {
    const spy = spyOn(apiService, 'get').and.returnValue(of({ endpoint_available: true }));
    const result$ = service.checkLocalLoginAvailability();
    expect(spy).toHaveBeenCalledWith('/user/login/authenticate');
    result$.subscribe((value) => {
      expect(value).toBe(true);
    });
  });

  it('#logOut non-login.gov happy path', async () => {
    testUserLoginData.token = 'testVal';
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(apiService, 'postAbsoluteUrl').and.returnValue(of('test'));
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutAction());
    expect(apiService.postAbsoluteUrl).toHaveBeenCalledTimes(0);
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });

  it('#logOut login.gov happy path', () => {
    testUserLoginData.token = null;
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutForLoginDotGovAction());
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });
});
