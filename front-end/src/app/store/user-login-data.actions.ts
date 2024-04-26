import { createAction, props } from '@ngrx/store';
import { UserLoginData } from '../shared/models/user.model';

export const userLoginDataRetrievedAction = createAction(
  '[User Login Data] Retrieved',
  props<{ payload: UserLoginData }>(),
);
export const userLoginDataUpdatedAction = createAction(
  '[User Login Data] Updated',
  props<{ payload: UserLoginData }>(),
);
export const userLoginDataDiscardedAction = createAction('[User Login Data] Discarded');
