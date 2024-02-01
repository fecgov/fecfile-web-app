import { createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { updateUserLoginDataAction, userLoggedInAction, userLoggedOutAction, userLoggedOutForLoginDotGovAction } from './login.actions';

export const initialState: UserLoginData = {
  first_name: '',
  last_name: '',
  email: '',
  login_dot_gov: false
};

export const loginReducer = createReducer(
  initialState,
  on(updateUserLoginDataAction, (_state, update) => update.payload),
  on(userLoggedInAction, (_state, update) => update.payload),
  on(userLoggedOutAction, () => initialState),
  on(userLoggedOutForLoginDotGovAction, () => initialState)
);
