import { createReducer, on, Action } from '@ngrx/store';
import { userLoggedInAction, userLoggedOutAction } from './login.actions';
import { UserLoginData } from 'app/shared/models/user.model';

export const initialState: UserLoginData = {
  committee_id: null,
  email: null,
  is_allowed: false,
  token: null,
};

const _loginReducer = createReducer(
  initialState,
  on(userLoggedInAction, (state, update) => update.payload),
  on(userLoggedOutAction, (state) => initialState)
);

export function loginReducer(state: UserLoginData | undefined, action: Action) {
  return _loginReducer(state, action);
}
