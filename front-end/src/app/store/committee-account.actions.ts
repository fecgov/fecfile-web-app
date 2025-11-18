import { createAction, props } from '@ngrx/store';
import { CommitteeAccount } from '../shared/models/committee-account.model';

export const setCommitteeAccountDetailsAction = createAction(
  '[Committee Account] Account Retrieved',
  props<{ payload: CommitteeAccount }>(),
);
