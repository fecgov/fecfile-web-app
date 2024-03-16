import { createReducer, on } from '@ngrx/store';
import { CommitteeAccount } from '../shared/models/committee-account.model';
import { setCommitteeAccountDetailsAction } from './committee-account.actions';
import { userLoginDataDiscardedAction } from './user-login-data.actions';

export const initialState: CommitteeAccount = new CommitteeAccount();

export const committeeAccountReducer = createReducer(
  initialState,
  on(setCommitteeAccountDetailsAction, (_state, update) => update.payload),
  on(userLoginDataDiscardedAction, () => initialState),
);
