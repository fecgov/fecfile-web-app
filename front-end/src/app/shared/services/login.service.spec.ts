import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ApiService } from './api.service';

import { LoginService } from './login.service';

describe('LoginService', () => {
  let service: LoginService;
  let httpTestingController: HttpTestingController;

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
});
