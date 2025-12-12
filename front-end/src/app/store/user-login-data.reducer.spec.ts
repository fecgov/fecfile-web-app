import { loginReducer } from './user-login-data.reducer';
import { userLoginDataUpdatedAction } from './user-login-data.actions';
import { UserLoginData } from '../shared/models/user.model';

describe('UserLoginData Reducer', () => {
  it('should set user login data', () => {
    const initialState: UserLoginData = {
      first_name: undefined,
      last_name: undefined,
      email: undefined,
      security_consent_version: undefined,
      security_consent_version_at_login: undefined,
    };
    const data: UserLoginData = {
      first_name: 'John',
      last_name: 'Doe',
      email: 'john@example.com',
      security_consent_version: '1.0',
      security_consent_version_at_login: '1.0',
    };
    const action = userLoginDataUpdatedAction({ payload: data });
    const state = loginReducer(initialState, action);
    expect(state.email).toEqual(data.email);
    expect(state.first_name).toEqual(data.first_name);
    expect(state.last_name).toEqual(data.last_name);
    expect(state.security_consent_version).toEqual(data.security_consent_version);
    expect(state.security_consent_version_at_login).toEqual(data.security_consent_version_at_login);
  });
});
