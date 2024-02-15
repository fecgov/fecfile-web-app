import { createReducer, on } from '@ngrx/store';
import { setCommitteeAccountDetailsAction } from './committee-account.actions';
import { CommitteeAccount } from '../shared/models/committee-account.model';
import { userLoggedOutAction } from './login.actions';

export const initialState: CommitteeAccount = new CommitteeAccount();

export const committeeAccountReducer = createReducer(
  initialState,
  on(setCommitteeAccountDetailsAction, (_state, update) => update.payload),
  on(userLoggedOutAction, () => initialState),
);
