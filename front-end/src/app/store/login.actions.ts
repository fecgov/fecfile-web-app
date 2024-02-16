import { createAction, props } from '@ngrx/store';
import { UserLoginData } from '../shared/models/user.model';

export const updateUserLoginDataAction = createAction(
  '[User Login Data] Update Data',
  props<{ payload: UserLoginData }>(),
);

export const userLoggedInAction = createAction('[Login] User Logged In', props<{ payload: UserLoginData }>());
export const userLoggedOutAction = createAction('[Login] User Logged Out');
