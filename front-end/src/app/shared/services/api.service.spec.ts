import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;

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
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });
    service = TestBed.inject(ApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('isAuthenticated should return true with committee_id set', () => {
    const retval = service.isAuthenticated();
    expect(retval).toBeTrue();
  });

});
