import { Action, createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import { setUserLoginDataAction } from './user-login-data.actions';

export const initialState: UserLoginData | undefined = undefined;

export const userLoginDataReducer = createReducer<UserLoginData | undefined, Action>(
  initialState,
  on(setUserLoginDataAction, (_state, update) => update.payload)
);
