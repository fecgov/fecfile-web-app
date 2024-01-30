import { createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { userLoggedInAction, userLoggedOutAction, userLoggedOutForLoginDotGovAction } from './login.actions';

export const initialState: UserLoginData = {};

export const loginReducer = createReducer(
  initialState,
  on(userLoggedInAction, (_state, update) => update.payload),
  on(userLoggedOutAction, () => initialState),
  on(userLoggedOutForLoginDotGovAction, () => initialState)
);
