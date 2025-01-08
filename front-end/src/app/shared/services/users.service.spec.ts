import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { environment } from 'environments/environment';
import { testMockStore } from '../utils/unit-test.utils';
import { ApiService } from './api.service';

import { Router } from '@angular/router';
import { UserLoginData } from '../models/user.model';
import { LoginService } from './login.service';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiService, LoginService, provideMockStore(testMockStore)],
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(UsersService);
    TestBed.inject(Router);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCurrentUser should be created', () => {
    expect(service).toBeTruthy();
  });

  it('#getCurrentUser should return user', () => {
    const testCurrentUser: UserLoginData = {
      first_name: 'testFirstName',
      last_name: 'testLastName',
      email: 'testEmail@testhost.com',
    };

    service.getCurrentUser().then((response) => {
      expect(response).toEqual(testCurrentUser);
    });

    const req = httpTestingController.expectOne(`${environment.apiUrl}/users/get_current/`);
    expect(req.request.method).toEqual('GET');
    req.flush(testCurrentUser);
    httpTestingController.verify();
  });
});
