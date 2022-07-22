import { createReducer, on, Action } from '@ngrx/store';
import { setCommitteeAccountDetailsAction } from './committee-account.actions';
import { CommitteeAccount } from '../shared/models/committee-account.model';

export const initialState: CommitteeAccount = new CommitteeAccount();

const _committeeAccountReducer = createReducer(
  initialState,
  on(setCommitteeAccountDetailsAction, (_state, update) => update.payload)
);

export function committeeAccountReducer(state: CommitteeAccount | undefined, action: Action) {
  return _committeeAccountReducer(state, action);
}
