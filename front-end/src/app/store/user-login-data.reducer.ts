import { createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import {
  userLoginDataDiscardedAction,
  userLoginDataRetrievedAction,
  userLoginDataUpdatedAction,
} from './user-login-data.actions';

export const initialState: UserLoginData = {
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  security_consented: undefined,
};

export const loginReducer = createReducer(
  initialState,
  on(userLoginDataRetrievedAction, (_state, update) => update.payload),
  on(userLoginDataUpdatedAction, (_state, update) => update.payload),
  on(userLoginDataDiscardedAction, () => initialState),
);
