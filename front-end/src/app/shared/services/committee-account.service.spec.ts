import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from '../models/user.model';
import { selectUserLoginData } from 'app/store/login.selectors';


import { CommitteeAccountService } from './committee-account.service';

describe('CommitteeAccountService', () => {
  let service: CommitteeAccountService;
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
        CommitteeAccountService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });

    service = TestBed.inject(CommitteeAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
