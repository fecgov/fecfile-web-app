import { Action, createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction, userLoggedOutAction, userLoggedOutForLoginDotGovAction } from './login.actions';

export const initialState: UserLoginData = {
  committee_id: null,
  email: null,
  is_allowed: false,
  token: null,
};

const _loginReducer = createReducer(
  initialState,
  on(userLoggedInAction, (_state, update) => update.payload),
  on(userLoggedOutAction, () => initialState),
  on(userLoggedOutForLoginDotGovAction, () => initialState)
);

export function loginReducer(state: UserLoginData | undefined, action: Action) {
  return _loginReducer(state, action);
}
