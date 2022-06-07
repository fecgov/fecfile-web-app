import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { UserLoginData } from 'app/shared/models/user.model';
import { ApiService } from 'app/shared/services/api.service';
import { selectUserLoginData } from 'app/store/login.selectors';
import { LoginGuard } from './login-page.guard';


describe('LoginGuard', () => {
  let guard: LoginGuard;

  const userLoginData: UserLoginData = {
    committee_id: 'C00000000',
    email: 'email@fec.com',
    is_allowed: true,
    token: 'jwttokenstring',
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [
        ApiService,
        provideMockStore({
          initialState: { fecfile_online_userLoginData: userLoginData },
          selectors: [{ selector: selectUserLoginData, value: userLoginData }],
        }),
      ],
    });
    guard = TestBed.inject(LoginGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
