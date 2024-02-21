import { createAction, props } from '@ngrx/store';
import { CommitteeAccount } from '../shared/models/committee-account.model';

export const setCommitteeAccountDetailsAction = createAction(
  '[Committee Account] Account Retrieved',
  props<{ payload: CommitteeAccount }>()
);

export const errorRetrievingAccountDetailsAction = createAction('[Committee Account] Account Loaded Error');
export const refreshCommitteeAccountDetailsAction = createAction('[Committee Account] Refresh Data');
