import { createReducer, on } from '@ngrx/store';
import { UserLoginData } from 'app/shared/models/user.model';
import {
  userLoginDataDiscardedAction,
  userLoginDataRetrievedAction,
  userLoginDataUpdatedAction,
} from './user-login-data.actions';
import { SECURITY_CONSENT_VERSION } from 'app/login/security-notice/security-notice.component';

export const initialState: UserLoginData = {
  first_name: undefined,
  last_name: undefined,
  email: undefined,
  security_consented: undefined,
  security_consent_version: undefined,
  security_consent_version_at_login: SECURITY_CONSENT_VERSION,
};

export const loginReducer = createReducer(
  initialState,
  on(userLoginDataRetrievedAction, (_state, update) => {
    return { ..._state, ...update.payload };
  }),
  on(userLoginDataUpdatedAction, (_state, update) => {
    return { ..._state, ...update.payload };
  }),
  on(userLoginDataDiscardedAction, () => initialState),
);
