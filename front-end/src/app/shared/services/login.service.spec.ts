import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { environment } from 'environments/environment';
import { ApiService } from './api.service';

import { userLoggedOutAction } from 'app/store/login.actions';
import { CookieService } from 'ngx-cookie-service';
import { of } from 'rxjs';
import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let store: MockStore;
  let apiService: ApiService;
  let httpTestingController: HttpTestingController;
  let cookieService: CookieService;

  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiService,
        LoginService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(LoginService);
    store  = TestBed.inject(MockStore);
    apiService = TestBed.inject(ApiService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#signIn should authenticate in the back end', () => {
    service.signIn('email@fec.gov', 'C00000000', 'test').subscribe((response: UserLoginData) => {
      expect(response).toEqual(userLoginData);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/login/authenticate`);
    expect(req.request.method).toEqual('POST');
    req.flush(userLoginData);
    httpTestingController.verify();
  });

  it('#validateCode should verify code in the back end', () => {
    service.validateCode('jwttokenstring').subscribe((response: UserLoginData) => {
      expect(response).toEqual(userLoginData);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/user/login/verify`);
    expect(req.request.method).toEqual('POST');
    req.flush(userLoginData);
    httpTestingController.verify();
  });

  it('#logOut non-login.gov happy path', async () => {  
    userLoginData.token = 'testVal';
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(apiService, 'postAbsoluteUrl').and.returnValue(of('test'));

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutAction());
    expect(apiService.postAbsoluteUrl).toHaveBeenCalledTimes(0);
  });

  it('#logOut login.gov happy path', () => {
    userLoginData.token = null;
    TestBed.resetTestingModule();

    spyOn(store, 'dispatch');
    spyOn(service, 'clearUserLoggedInCookies');
    spyOn(cookieService, 'delete');

    service.logOut();
    expect(store.dispatch).toHaveBeenCalledWith(userLoggedOutAction());
    expect(service.clearUserLoggedInCookies).toHaveBeenCalledTimes(1);
    expect(cookieService.delete).toHaveBeenCalledOnceWith('csrftoken');
  });

});
