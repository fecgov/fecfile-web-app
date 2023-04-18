import { createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction, userLoggedOutAction, userLoggedOutForLoginDotGovAction } from './login.actions';

export const initialState: UserLoginData = {
  committee_id: '',
  email: '',
  is_allowed: false,
  login_dot_gov: false,
};

export const loginReducer = createReducer(
  initialState,
  on(userLoggedInAction, (_state, update) => update.payload),
  on(userLoggedOutAction, () => initialState),
  on(userLoggedOutForLoginDotGovAction, () => initialState)
);
