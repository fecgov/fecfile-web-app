import { UserLoginData } from 'app/shared/models/user.model';
import { setUserLoginDataAction } from './user-login-data.actions';
import { userLoginDataReducer } from './user-login-data.reducer';

describe('UserLoginDataReducer', () => {
  it('it should store a UserLoginData', () => {
    const userLoginData: UserLoginData = {
      first_name: 'test_fn1',
      last_name: 'test_ln1',
      email: 'test_email1@testhost.com',
      login_dot_gov: true
    };
    const action = {
      type: setUserLoginDataAction.type,
      payload: userLoginData,
    };
    const result = userLoginDataReducer(userLoginData, action);
    expect(result?.email).toBe('test_email1@testhost.com');
  });
});
